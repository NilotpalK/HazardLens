# HazardLens — System Architecture

This document describes the full system architecture of HazardLens: how data flows from a social media post to a pin on the map, what each module does, and the design decisions behind them.

---

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT  (React + Vite)                        │
│                                                                        │
│   ┌──────────┐  ┌───────────┐  ┌──────────────┐  ┌──────────────────┐  │
│   │ LiveMap  │  │ TweetFeed │  │ TimelinePanel│  │  AddTweetModal   │  │
│   │ (MapLibre│  │ (live     │  │ (Recharts    │  │  (citizen report │  │
│   │  + Aren.)│  │  sidebar) │  │  playback)   │  │   submission)    │  │
│   └────▲─────┘  └────▲──────┘  └──────▲───────┘  └───────┬──────────┘  │
│        │             │               │                   │             │
│        └─────────────┴───────┬───────┘                   │             │
│                              │ SSE stream                │ POST        │
│                              │ /api/events/stream        │ /api/tweet  │
└──────────────────────────────┼───────────────────────────┼─────────────┘
                               │                           │
┌──────────────────────────────┼───────────────────────────┼─────────────┐
│                          SERVER  (Express.js)                          │
│                              │                           │             │
│   ┌──────────────────────────▼───────────────────────────▼──────────┐  │
│   │                      processTweet()                             │  │
│   │                                                                 │  │
│   │   ┌─────────────┐   ┌──────────────┐   ┌────────────────────┐  │  │
│   │   │ translator  │──▶│ nlpPipeline  │──▶│    geocoder        │  │  │
│   │   │ (Google     │   │ (NER + noise │   │ (80+ NE India      │  │  │
│   │   │  Translate) │   │  filter)     │   │  locations)        │  │  │
│   │   └─────────────┘   └──────────────┘   └────────────────────┘  │  │
│   └────────────────────────────┬────────────────────────────────────┘  │
│                                │                                       │
│   ┌────────────────────────────▼────────────────────────────────────┐  │
│   │                      EventStore                                 │  │
│   │  (in-memory ring buffer, max 500 events, aggregation methods)   │  │
│   └─────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │   fakeData.js — 120 realistic tweets for simulation/demo        │  │
│   └─────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow — End to End

### 1. Ingestion

A tweet enters the system via one of two paths:

| Path | Source | Entry point |
|------|--------|-------------|
| **Simulation** | `fakeData.js` generates realistic disaster tweets every 8 seconds | `setInterval` → `processTweet()` |
| **Citizen report** | User submits via AddTweetModal in the UI | `POST /api/tweet` → `processTweet()` |

In production, the simulation layer would be replaced by a Twitter/X API listener or a scraping service. The rest of the pipeline stays identical.

### 2. Translation

```
Tweet text (any language)
        │
        ▼
   translator.js
   ┌──────────────────────────────┐
   │ Google Translate API (free)  │
   │ auto-detect → English       │
   │                              │
   │ Returns:                     │
   │   translatedText: string     │
   │   detectedLanguage: "hi"|"as"│
   └──────────────────────────────┘
        │
        ▼
   English text goes to NLP
   Original text preserved for UI
```

Supports Assamese, Hindi, Bengali, Manipuri, Mizo, and any other language Google Translate covers. If the language is already English, translation is a no-op. If the API fails, the original text passes through unchanged (graceful fallback).

### 3. NLP Pipeline (`nlpPipeline.js`)

The NER engine runs entirely on the server with zero external dependencies. No transformers, no ML models, no API keys.

```
English text
    │
    ├──▶ classifyDisaster()     → { type: "flood", score: 3 }
    │    Keyword matching across 6 categories, weighted by type.
    │    ~50 keywords for flood alone (including translated regional terms).
    │
    ├──▶ extractLocations()     → ["nagaon", "assam"]
    │    Matches against 80+ hand-curated NE India place names.
    │    Sorted longest-first to avoid partial overlap.
    │
    ├──▶ assessSeverity()       → { level: 4, label: "critical" }
    │    4 severity tiers based on keyword intensity.
    │    "devastating" = critical, "damaged" = moderate, etc.
    │
    ├──▶ extractAffectedCount() → 5000
    │    Regex patterns for "N people/houses/killed/displaced".
    │
    ├──▶ calculateConfidence()  → 0.65
    │    Composite score from location + disaster score + severity.
    │    Threshold: 0.3 minimum to accept.
    │
    └──▶ calculateRelevancy()   → 0.58
         Multi-signal noise filter (details below).
```

#### Disaster Categories

| Category | Keywords (sample) | Weight |
|----------|-------------------|--------|
| Flood | flood, submerged, waterlogged, waist-deep, drainage, dirty water, displaced | 1.0 |
| Landslide | landslide, mudslide, road blocked, debris flow, hill collapse | 1.0 |
| Heavy Rain | torrential, cloudburst, downpour, IMD warning, continuous rain | 0.8 |
| Infrastructure | bridge collapse, power outage, dam breach, drainage system | 0.9 |
| Earthquake | earthquake, tremor, seismic, richter, aftershock | 1.0 |
| Storm | cyclone, thunderstorm, hailstorm, lightning, gale | 0.9 |

#### Severity Levels

| Level | Label | Trigger keywords |
|-------|-------|-----------------|
| 4 | Critical | devastating, SOS, death toll, NDRF deployed, mass evacuation |
| 3 | High | severe, trapped, destroyed, washed away, thousands |
| 2 | Moderate | damaged, alert, warning, rising, waterlogging |
| 1 | Low | minor, isolated, monitoring, brief |

### 4. Relevancy Engine — The Noise Filter

This is the most research-informed part of the pipeline. Real social media is full of sarcasm, old references, movie reviews, and promotional content that happen to mention disaster keywords. The relevancy engine scores each tweet across 5 signals:

```
┌─────────────────────────────────────────────────────┐
│              RELEVANCY SCORE (0.0–1.0)              │
│                  Threshold: 0.40                    │
│                                                     │
│  Text Quality ──────────── 35%  ◀ strongest signal  │
│  Source Credibility ─────── 20%                      │
│  Cross-Reference ────────── 20%  ◀ corroboration    │
│  Temporal Coherence ─────── 15%                      │
│  Engagement ──────────────── 10%  ◀ weakest (gameable)│
└─────────────────────────────────────────────────────┘
```

| Signal | What it measures | Boosts | Penalties |
|--------|-----------------|--------|-----------|
| **Text Quality** | Witness language, specificity, urgency markers | "I can see", "right now", numbers + entities | Sarcasm (lol, 😂), past references, promotions, short text |
| **Source Credibility** | Known handle trust + account metadata | Verified accounts, official agencies (NDRF, IMD) | New accounts (<30 days), unknown handles |
| **Cross-Reference** | Corroboration from same location in last 30 min | 5+ reports from same area = 0.95 | Isolated report with no corroboration = 0.30 |
| **Temporal Coherence** | Present-tense vs past-tense language | "happening now", "breaking", "currently" | "remember when", "throwback", "years ago" |
| **Engagement** | Retweets, likes, replies (log-scaled) | Viral (500+) = boost | Zero engagement = neutral (not penalized) |

**Design rationale (based on Castillo 2011, Imran 2015):** Text quality is the strongest discriminator for disaster relevance. Engagement is deliberately down-weighted because it's gameable by bots and penalizes legitimate first-person reports that are posted before going viral. Cross-reference (spatiotemporal clustering) is the gold standard for verification.

**Manual reports bypass the relevancy filter entirely** — a citizen who opens the Report modal to describe a disaster is not noise.

### 5. Geocoding (`geocoder.js`)

```
Location name (from NLP or user input)
        │
        ▼
   Direct match  →  { lat, lng, state, type, confidence: 1.0 }
        │ (miss)
        ▼
   Partial match →  { ..., confidence: 0.8 }
        │ (miss)
        ▼
   State centroid → { ..., confidence: 0.5 }
        │ (miss)
        ▼
   null (event dropped — no geo, no map pin)
```

The dictionary covers 80+ locations:
- All major cities and district HQs across 8 NE states
- Key rivers (Brahmaputra, Barak, Subansiri, Teesta, etc.)
- State names as fallback centroids
- Coordinates have ±0.02° jitter applied so overlapping events don't stack on a single pixel

### 6. Event Object

After passing all filters, the structured event looks like this:

```json
{
  "id": "tw_custom_1714500000_abc123",
  "text": "নগাঁৱত বানপানীৰ পৰিস্থিতি অত্যন্ত ভয়াৱহ...",
  "translatedText": "The flood situation in Nagaon is devastating...",
  "handle": "@citizen",
  "source": "manual",
  "timestamp": "2026-05-01T03:21:00.000Z",
  "disasterType": "flood",
  "severity": "critical",
  "severityLevel": 4,
  "locations": ["nagaon"],
  "locationName": "nagaon",
  "state": "Assam",
  "lat": 26.352,
  "lng": 92.689,
  "confidence": 0.65,
  "affectedCount": null,
  "relevancyScore": 0.58,
  "engagement": { "likes": 0, "retweets": 0, "replies": 0, "views": 0 }
}
```

### 7. Broadcasting

Events are stored in the `EventStore` (in-memory ring buffer, max 500) and broadcast to all connected clients via **Server-Sent Events**:

```
Server                              Client
  │                                    │
  │── SSE connection ─────────────────▶│ EventSource("/api/events/stream")
  │                                    │
  │◀─ { type: "connected" } ──────────│
  │                                    │
  │── event JSON ─────────────────────▶│ onmessage → setEvents(prev => [...prev, event])
  │── event JSON ─────────────────────▶│ (auto-updates map + feed + timeline)
  │── event JSON ─────────────────────▶│
  │   ...                              │
```

SSE was chosen over WebSocket because the data flow is strictly server→client. No bidirectional channel needed.

---

## Frontend Architecture

### Component Tree

```
App.jsx
├── Navbar                      (theme toggle, live indicator, report button)
├── LiveMap                     (MapLibre GL + Arenarium MapManager)
│   ├── Heatmap layer           (geojson source → heatmap-layer)
│   └── Marker layer            (severity-colored pins + tooltips + popups)
├── TweetFeed                   (collapsible sidebar)
│   └── TweetCard × N           (translate button if non-English)
├── StatsPanel                  (live event counts, severity breakdown)
├── TimelinePanel               (Recharts area chart + playback)
├── AlertBanner                 (critical-severity alerts + browser notifications)
└── AddTweetModal               (citizen report form + location autocomplete)
```

### Map Stack

```
MapLibre GL JS
    └── @arenarium/maps-integration-maplibre (MaplibreProvider)
        └── @arenarium/maps (MapManager)
            ├── Markers with custom pin elements (severity-colored dots)
            ├── Tooltips (tweet card preview on hover)
            └── Popups (full tweet detail on click)
```

The map supports dark/light theme switching via Arenarium's `MaplibreDarkStyle` / `MaplibreLightStyle`. Layers are re-bound on `style.load` to persist across theme transitions.

### State Management

Plain React `useState` + `useEffect`. No Redux, no Zustand. State is lifted to `App.jsx`:

| State | Lives in | Consumed by |
|-------|----------|-------------|
| `events` | App | LiveMap, TweetFeed, StatsPanel, TimelinePanel |
| `isDarkMode` | App | Navbar (toggle), LiveMap (style) |
| `showAddModal` | App | Navbar (button), AddTweetModal |
| `criticalAlert` | App | AlertBanner |
| `heatmapActive` | App | LiveMap |

---

## API Surface

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/events` | All events (optional `?start=&end=` for time range) |
| GET | `/api/events/recent?count=50` | Last N events |
| GET | `/api/events/stream` | SSE stream |
| GET | `/api/events/filtered?minRelevancy=0.4` | Events above relevancy threshold |
| GET | `/api/stats` | Aggregated stats (by type, state, severity, hour) |
| GET | `/api/trends?hours=48` | Hourly bucketed trend data |
| GET | `/api/heatmap` | Lat/lng + intensity for heatmap layer |
| GET | `/api/locations` | All known location names (for autocomplete) |
| POST | `/api/tweet` | Submit a citizen report `{ text, handle, location }` |
| POST | `/api/simulate` | Batch-generate N tweets |
| POST | `/api/simulation/start` | Start auto-generation interval |
| POST | `/api/simulation/stop` | Pause auto-generation |
| GET | `/api/simulation/status` | Check if simulation is running |

---

## Translation & Multilingual Support

The system handles non-English input at two levels:

**Server-side (NLP):** Every incoming tweet is passed through `translator.js` before the NLP pipeline. The translated English text is what gets classified. This ensures disaster keywords are detected regardless of the input language.

**Client-side (UI):** The original text is always displayed in the feed and on the map. If the tweet was translated, a "Translate" button appears. Clicking it toggles between the original language and English. No additional API call — the translated text is already stored in the event object from when it was first processed.

Tested with: Hindi, Assamese, Bengali, Manipuri, Mizo.

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Rule-based NER over ML models | Zero latency, no GPU, no API costs, deterministic behavior. For a domain-specific task with known vocabulary (NE India disasters), rules outperform generic models. |
| SSE over WebSocket | Unidirectional data flow. Simpler, auto-reconnects, works through most proxies. |
| In-memory store over database | Hackathon scope. EventStore is a ring buffer that caps at 500 events. Trivially swappable for Postgres/Redis later. |
| Free Google Translate endpoint | No API key needed, supports 100+ languages, fast enough for prototype (~200ms). Would swap for official API or self-hosted model in production. |
| Relevancy engine weights | Based on Castillo et al. (2011) and Imran et al. (2015). Text quality is the best discriminator; engagement is gameable. |
| Manual reports bypass noise filter | A user who explicitly opens the Report form is inherently trustworthy. The noise filter was designed for scraped social media, not deliberate submissions. |
| Jittered coordinates | Without jitter, multiple events in "Nagaon" would stack on the exact same pixel. ±0.02° spread makes clusters visible. |

---

## File Map

```
server/
├── index.js           Express app, SSE setup, processTweet orchestrator,
│                      simulation loop, all REST routes
├── nlpPipeline.js     NER engine: classifyDisaster, extractLocations,
│                      assessSeverity, extractAffectedCount, relevancy engine
│                      (5-signal weighted scorer)
├── translator.js      Google Translate wrapper (auto-detect → English)
├── geocoder.js        80+ NE India locations with lat/lng, state centroids,
│                      geocodeBest with confidence ranking
├── eventStore.js      In-memory ring buffer with getStats, getTrendData,
│                      getHeatmapData, getRecentByLocation (for corroboration)
└── fakeData.js        120 realistic tweet templates, 10 noise tweets for
                       testing the relevancy filter

src/
├── App.jsx            Root shell, global state, SSE listener, theme control
├── index.css          Design system tokens (colors, severity palette, glass
│                      morphism, animations, scrollbar, badge styles)
├── utils/api.js       API client, DISASTER_TYPES config, postCustomTweet,
│                      fetchLocations, createEventStream
└── components/
    ├── LiveMap.jsx     MapLibre + Arenarium integration, heatmap layer,
    │                   marker/tooltip/popup rendering with translate buttons
    ├── TweetFeed.jsx   Collapsible feed, TweetCard with translate toggle,
    │                   disaster type filters, auto-scroll
    ├── AddTweetModal   Citizen report form with location autocomplete
    │                   (fetches from /api/locations), calls POST /api/tweet
    ├── TimelinePanel   Recharts area chart, hourly buckets, playback
    ├── StatsPanel      Live counters, severity breakdown, most affected area
    ├── AlertBanner     Critical event banner + browser Notification API
    └── Navbar          Theme toggle, live pulse indicator, report button
```
