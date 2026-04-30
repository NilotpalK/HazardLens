// HazardLens Express Server — REST API + SSE for real-time streaming

import express from "express";
import cors from "cors";
import { processText } from "./nlpPipeline.js";
import { geocodeBest, jitter } from "./geocoder.js";
import { generateTweet, generateHistoricalBatch } from "./fakeData.js";
import { EventStore } from "./eventStore.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const store = new EventStore(500);
const sseClients = [];

// --- SSE Setup ---
function broadcastEvent(event) {
  sseClients.forEach((res) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  });
}

app.get("/api/events/stream", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);
  sseClients.push(res);
  req.on("close", () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
  });
});

// --- Process a raw tweet into a structured event ---
function processTweet(tweet) {
  const nlp = processText(tweet.text);
  if (!nlp.isDisaster) return null;

  const geo = geocodeBest(
    nlp.locations.length > 0 ? nlp.locations : tweet.hintLocations || [],
  );
  if (!geo) return null;

  return {
    id: tweet.id,
    text: tweet.text,
    handle: tweet.handle,
    source: tweet.source,
    timestamp: tweet.timestamp,
    disasterType: nlp.disasterType,
    severity: nlp.severity,
    severityLevel: nlp.severityLevel,
    locations: nlp.locations,
    locationName: geo.matchedName || nlp.locations[0],
    state: geo.state,
    lat: jitter(geo.lat),
    lng: jitter(geo.lng),
    confidence: nlp.confidence,
    affectedCount: nlp.affectedCount,
  };
}

// --- REST Endpoints ---
app.get("/api/events", (req, res) => {
  const { start, end } = req.query;
  if (start && end) {
    res.json(store.getByTimeRange(Number(start), Number(end)));
  } else {
    res.json(store.getAll());
  }
});

app.get("/api/events/recent", (req, res) => {
  const count = parseInt(req.query.count) || 50;
  res.json(store.getRecent(count));
});

app.get("/api/stats", (req, res) => {
  res.json(store.getStats());
});

app.get("/api/trends", (req, res) => {
  const hours = parseInt(req.query.hours) || 48;
  res.json(store.getTrendData(hours));
});

app.get("/api/heatmap", (req, res) => {
  const { start, end } = req.query;
  res.json(
    store.getHeatmapData(
      start ? Number(start) : null,
      end ? Number(end) : null,
    ),
  );
});

app.post("/api/simulate", (req, res) => {
  const count = Math.min(parseInt(req.body?.count) || 10, 50);
  const events = [];
  for (let i = 0; i < count; i++) {
    const tweet = generateTweet();
    const event = processTweet(tweet);
    if (event) {
      store.add(event);
      broadcastEvent(event);
      events.push(event);
    }
  }
  res.json({ generated: events.length, events });
});

// --- Seed historical data on startup ---
function seedHistoricalData() {
  const historicalTweets = generateHistoricalBatch(80, 48);
  let seeded = 0;
  for (const tweet of historicalTweets) {
    const event = processTweet(tweet);
    if (event) {
      store.add(event);
      seeded++;
    }
  }
  console.log(`📊 Seeded ${seeded} historical events`);
}

// --- Auto-generate tweets at intervals ---
let simulationInterval = null;
let simulationSpeed = 8000; // ms between tweets

function startSimulation() {
  if (simulationInterval) return;
  simulationInterval = setInterval(() => {
    const tweet = generateTweet();
    const event = processTweet(tweet);
    if (event) {
      store.add(event);
      broadcastEvent(event);
    }
  }, simulationSpeed);
  console.log(`▶️  Simulation started (interval: ${simulationSpeed}ms)`);
}

function stopSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log("⏸️  Simulation paused");
  }
}

app.post("/api/simulation/start", (req, res) => {
  simulationSpeed = Math.max(2000, parseInt(req.body?.interval) || 8000);
  stopSimulation();
  startSimulation();
  res.json({ status: "running", interval: simulationSpeed });
});

app.post("/api/simulation/stop", (req, res) => {
  stopSimulation();
  res.json({ status: "stopped" });
});

app.get("/api/simulation/status", (req, res) => {
  res.json({ running: !!simulationInterval, interval: simulationSpeed });
});

// --- Start ---
seedHistoricalData();
startSimulation();

app.listen(PORT, () => {
  console.log(`\n🔴 HazardLens Server running on http://localhost:${PORT}`);
  console.log(`📡 SSE stream: http://localhost:${PORT}/api/events/stream`);
  console.log(`🗺️  Events: http://localhost:${PORT}/api/events\n`);
});
