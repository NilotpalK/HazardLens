# 🔴 HazardLens — Real-Time Disaster Intelligence for North-East India

> **NER Hackathon Project** — Uses social media signals + NLP to detect disasters early and visualize them on a live map.

![HazardLens](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-19-blue) ![MapLibre](https://img.shields.io/badge/MapLibre_GL-Free-orange) ![Node](https://img.shields.io/badge/Node.js-Express-green)

---

## 🎯 The Problem

North-East India faces **frequent floods** (Brahmaputra basin), **landslides** in hilly regions, and **heavy monsoon rainfall**. Disaster response is slow because information reaches authorities late.

**Key Insight:** During disasters, people post on social media *immediately* — but this data is unstructured and ignored by official response systems.

## 💡 Our Solution

HazardLens monitors social media signals in real-time, performs **Named Entity Recognition (NER)** to extract disaster information, and visualizes detected events on a **live interactive map** with hotspot tracking.

```
Social Media → NER Pipeline → Geocoding → Live Map + Alerts
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🗺️ **Live Map** | MapLibre GL dark map with severity-colored markers across NE India |
| 🔥 **Heatmap Hotspots** | Density overlay showing disaster spread patterns |
| 📡 **Real-Time Feed** | SSE-powered live tweet stream with auto-scroll |
| 🧠 **NER Pipeline** | Extracts LOCATION, DISASTER_TYPE, SEVERITY, AFFECTED_COUNT |
| 📊 **Timeline Trends** | Recharts area chart with playback showing spread over time |
| 🚨 **Push Notifications** | Browser alerts for critical-severity disasters |
| 🎮 **Simulation Controls** | Play/pause, speed control for demo purposes |
| 🔍 **Filter by Type** | Flood, Landslide, Heavy Rain, Infrastructure |

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/NilotpalK/HazardLens.git
cd HazardLens

# Install dependencies
npm install

# Terminal 1 — Start backend
npm run server

# Terminal 2 — Start frontend
npm run dev
```

Open **http://localhost:5173** 🎉

---

## 🏗️ Architecture

```
HazardLens/
├── server/
│   ├── index.cjs           # Express server + SSE streaming
│   ├── nlpPipeline.cjs     # NER engine — classification + entity extraction
│   ├── geocoder.cjs        # 80+ NE India locations with lat/lng
│   ├── fakeData.cjs        # 120 realistic disaster tweets for demo
│   └── eventStore.cjs      # In-memory store with aggregations
├── src/
│   ├── App.jsx              # Main app shell
│   ├── components/
│   │   ├── LiveMap.jsx      # MapLibre GL map + heatmap layer
│   │   ├── TweetFeed.jsx    # Real-time tweet sidebar
│   │   ├── TimelinePanel.jsx# Trend charts + playback
│   │   ├── StatsPanel.jsx   # Live statistics
│   │   ├── AlertBanner.jsx  # Critical alert + push notifications
│   │   └── Navbar.jsx       # Controls + live indicator
│   └── utils/api.js         # API client + constants
```

### NLP Pipeline

The NER engine uses rule-based extraction optimized for disaster contexts:

- **Disaster Classification** — Keyword matching across 6 categories (flood, landslide, heavy rain, infrastructure, earthquake, storm)
- **Location Extraction** — Matches against 80+ NE India place names (districts, cities, rivers)
- **Severity Assessment** — 4 levels (critical → high → moderate → low) based on keyword intensity
- **Affected Count** — Regex extraction of casualty/displacement numbers

### Coverage

All **8 North-East states**: Assam, Meghalaya, Nagaland, Manipur, Mizoram, Tripura, Arunachal Pradesh, Sikkim

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Map**: MapLibre GL JS (free, open-source)
- **Tiles**: CartoDB Dark Matter (free, no API key)
- **Charts**: Recharts
- **Backend**: Express.js
- **Streaming**: Server-Sent Events (SSE)
- **NLP**: Custom rule-based NER engine

---

## 🎬 Demo Tips

1. Enable **Heatmap** to see disaster density hotspots
2. Open **Timeline** and hit ▶ to watch disaster spread over time
3. Click any tweet to **fly to its location** on the map
4. Set speed to **Fast (3s)** for rapid real-time demo
5. Watch for **critical alert banners** with push notifications

---

## 📄 License

MIT

---

*Built for the NER Hackathon — Tackling disaster response in North-East India through social media intelligence.*
