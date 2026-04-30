# HazardLens

Real-time disaster detection for North-East India — built on social media signals and a lightweight NLP pipeline.

NE India deals with frequent floods, landslides, and heavy monsoon events year-round. The problem isn't that disasters are unpredictable — it's that information reaches the people who need it too slowly. When something goes wrong, locals post about it immediately. HazardLens taps into that signal, extracts what matters, and puts it on a live map.

---

## What it does

HazardLens monitors a social media feed, runs each post through a Named Entity Recognition pipeline, and plots detected events on an interactive map in real time. You get severity-colored markers across all 8 NE states, a heatmap showing where things are clustering, and a timeline that lets you replay how a situation spread over time.

Social media post → NER pipeline → geocoding → live map + alerts

The NER engine is rule-based and tuned specifically for disaster contexts. It extracts four things from each post: the location, the disaster type, the severity, and any affected counts mentioned. No external NLP API needed.

---

## Getting started

bash
git clone https://github.com/NilotpalK/HazardLens.git
cd HazardLens
npm install

# Terminal 1

npm run server

# Terminal 2

npm run dev

Open http://localhost:5173.

---

## Features

- _Live map_ — MapLibre GL dark map with severity-colored markers across NE India
- _Heatmap_ — density overlay that shows where events are concentrating
- _Tweet feed_ — SSE-powered stream that auto-scrolls as new events come in; click any tweet to fly to its location on the map
- _Timeline_ — area chart with playback controls so you can watch a situation unfold over time
- _Filters_ — toggle between flood, landslide, heavy rain, and infrastructure events
- _Push notifications_ — browser alerts fire on critical-severity events
- _Simulation controls_ — play/pause and speed controls, useful for demos

---

## Architecture

```
HazardLens/
├── server/
│ ├── index.js # Express server + SSE streaming
│ ├── nlpPipeline.js # NER engine — classification + entity extraction
│ ├── geocoder.js # 80+ NE India locations with lat/lng
│ ├── fakeData.js # 120 realistic disaster tweets for demo
│ └── eventStore.js # In-memory store with aggregations
└── src/
├── App.jsx
└── components/
├── LiveMap.jsx # MapLibre GL map + heatmap layer
├── TweetFeed.jsx # Real-time tweet sidebar
├── TimelinePanel.jsx # Trend charts + playback
├── StatsPanel.jsx # Live statistics
├── AlertBanner.jsx # Critical alert + push notifications
└── Navbar.jsx # Controls + live indicator
```

### NLP pipeline

The NER engine does keyword-based classification across 6 disaster categories (flood, landslide, heavy rain, infrastructure, earthquake, storm), matches locations against a hand-curated list of 80+ NE India place names, assigns severity across 4 levels based on keyword intensity, and uses regex to pull out casualty or displacement numbers when they appear.

Coverage spans all 8 states: Assam, Meghalaya, Nagaland, Manipur, Mizoram, Tripura, Arunachal Pradesh, and Sikkim.

---

## Stack

| Layer     | Tech                                   |
| --------- | -------------------------------------- |
| Frontend  | React 19 + Vite                        |
| Map       | MapLibre GL JS                         |
| Tiles     | CartoDB Dark Matter (free, no API key) |
| Charts    | Recharts                               |
| Backend   | Express.js                             |
| Streaming | Server-Sent Events                     |
| NLP       | Custom rule-based NER                  |

---

## Demo tips

- Turn on the _heatmap_ first — it immediately shows you where activity is clustering
- Open the _timeline_ and hit play to watch events unfold chronologically
- Crank speed to _Fast (3s)_ if you're demoing live
- Click any tweet in the sidebar to jump the map to that location
- Wait for a critical event to trigger the alert banner + browser notification

---

```

```
