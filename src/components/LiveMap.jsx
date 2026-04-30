import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapManager } from "@arenarium/maps";
import { MaplibreProvider, MaplibreLightStyle, MaplibreDarkStyle } from "@arenarium/maps-integration-maplibre";
import "@arenarium/maps/style.css";
import { DISASTER_TYPES, timeAgo } from "../utils/api";
import "./LiveMap.css";

const NE_INDIA_CENTER = [92.5, 26.0];

const SEVERITY_COLORS = {
  critical: "#ef4444",
  high: "#f97316",
  moderate: "#eab308",
  low: "#3b82f6",
};

const SEVERITY_PIN_BG = {
  critical: "#ef444466",
  high: "#f9731666",
  moderate: "#eab30866",
  low: "#3b82f666",
};

// --- Pin: severity-colored dot ---
const createPinElement = (severity) => {
  const el = document.createElement("div");
  el.className = `disaster-marker ${severity}-marker`;
  el.style.width = "100%";
  el.style.height = "100%";
  return el;
};

// Twitter/X SVG icons (14x14)
const ICON = {
  reply: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  heart: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  retweet: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2h3.5v2H7.5c-2.21 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H13V4h3.5c2.21 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/></svg>',
  views: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8.75 21V3h2v18h-2zM18.75 21V8.5h2V21h-2zM13.75 21v-9h2v9h-2zM3.75 21v-4h2v4h-2z"/></svg>',
};

// --- Tooltip: tweet card on map with Twitter icons ---
const createTooltipElement = (event) => {
  const el = document.createElement("div");
  el.className = "map-tweet-card";
  const engagement = event.engagement || {};
  const severity = event.severity || "low";

  const fmt = (n) => {
    if (!n) return "0";
    if (n >= 1000) return (n / 1000).toFixed(1) + "k";
    return n.toString();
  };

  el.innerHTML = `
    <div class="mtc-header">
      <div class="mtc-dot ${severity}"></div>
      <span class="mtc-name">${event.locationName || "Unknown"}</span>
      <span class="mtc-handle">${event.handle || "@unknown"}</span>
    </div>
    <div class="mtc-text">${event.text.substring(0, 100)}${event.text.length > 100 ? "…" : ""}</div>
    <div class="mtc-footer">
      <span class="mtc-stat">${ICON.reply} ${fmt(engagement.replies)}</span>
      <span class="mtc-stat">${ICON.heart} ${fmt(engagement.likes)}</span>
      <span class="mtc-stat">${ICON.retweet} ${fmt(engagement.retweets)}</span>
    </div>
  `;
  return el;
};

// --- Popup: expanded view with Twitter icons ---
const createPopupElement = (event) => {
  const el = document.createElement("div");
  el.className = "map-tweet-popup";
  const engagement = event.engagement || {};
  const severity = event.severity || "low";
  const typeLabel = DISASTER_TYPES[event.disasterType]?.label || "Unknown";
  const relevancy = event.relevancyScore ? Math.round(event.relevancyScore * 100) : "—";

  el.innerHTML = `
    <div class="mtp-header">
      <div class="mtp-dot ${severity}"></div>
      <div class="mtp-user">
        <span class="mtp-name">${event.locationName || "Unknown"}${event.state ? ", " + event.state : ""}</span>
        <span class="mtp-handle">${event.handle || "@unknown"}</span>
      </div>
      <span class="mtp-severity">${severity}</span>
    </div>
    <div class="mtp-text">${event.text}</div>
    <div class="mtp-meta">
      <span class="mtp-type">${typeLabel}</span>
      <span class="mtp-separator">·</span>
      <span class="mtp-time">${timeAgo(event.timestamp)}</span>
      <span class="mtp-separator">·</span>
      <span class="mtp-relevancy">${relevancy}%</span>
    </div>
    <div class="mtp-engagement">
      <span>${ICON.reply} ${engagement.replies || 0}</span>
      <span>${ICON.heart} ${engagement.likes || 0}</span>
      <span>${ICON.retweet} ${engagement.retweets || 0}</span>
      <span>${ICON.views} ${engagement.views || 0}</span>
    </div>
  `;
  return el;
};



export default function LiveMap({ events, heatmapActive, selectedEvent, isDarkMode }) {
  const mapContainer = useRef(null);
  const providerRef = useRef(null);
  const managerRef = useRef(null);
  const [tokenMissing, setTokenMissing] = useState(false);

  // Initialize map
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const token = import.meta.env.VITE_ARENARIUM_TOKEN;
        if (!token || token === "your_token_here") {
          setTokenMissing(true);
          return;
        }

        if (providerRef.current) return;

        const maplibreProvider = new MaplibreProvider(
          maplibregl.Map,
          maplibregl.Marker,
          {
            container: mapContainer.current,
            style: MaplibreDarkStyle,
            center: NE_INDIA_CENTER,
            zoom: 6.5,
            maxBounds: [
              [82, 18],
              [102, 33],
            ],
            pitch: 0,
            antialias: true,
          },
        );

        const createdManager = await MapManager.create(
          token,
          maplibreProvider,
          {
            pin: {
              fadeout: {
                scale: 0.25,
                color: 0,
              },
              depth: 2,
            },
            popup: { pan: true },
            events: {
              error: (message, err) => {
                console.error("Map error:", message, err);
              },
            },
          },
        );

        if (cancelled) {
          maplibreProvider.getMap().remove();
          createdManager.removeMarkers();
          return;
        }

        managerRef.current = createdManager;
        providerRef.current = maplibreProvider;

        const mapInstance = maplibreProvider.getMap();

        mapInstance.addControl(
          new maplibregl.NavigationControl({ showCompass: false }),
          "bottom-left",
        );

        mapInstance.on("load", () => {
          if (cancelled) return;
          requestAnimationFrame(() => {
            mapInstance.resize();
          });
        });
      } catch (err) {
        console.error("Map init failed:", err);
      }
    };

    init();

    return () => {
      cancelled = true;
      if (providerRef.current) {
        providerRef.current.getMap().remove();
        providerRef.current = null;
      }
      if (managerRef.current) {
        managerRef.current.removeMarkers();
        managerRef.current = null;
      }
    };
  }, []);

  // Handle style switching
  useEffect(() => {
    if (!providerRef.current) return;
    const map = providerRef.current.getMap();
    const targetStyle = isDarkMode ? MaplibreDarkStyle : MaplibreLightStyle;
    
    if (map.isStyleLoaded()) {
      map.setStyle(targetStyle);
    } else {
      map.once("load", () => map.setStyle(targetStyle));
    }
  }, [isDarkMode]);

  // Toggle heatmap visibility
  useEffect(() => {
    if (!providerRef.current) return;
    const map = providerRef.current.getMap();
    const setVisibility = () => {
      try {
        if (map.getLayer("heatmap-layer")) {
          map.setLayoutProperty(
            "heatmap-layer",
            "visibility",
            heatmapActive ? "visible" : "none",
          );
        }
      } catch (e) {
        /* layer may not exist yet */
      }
    };
    if (map.isStyleLoaded()) {
      setVisibility();
    } else {
      map.once("load", setVisibility);
    }
  }, [heatmapActive, tokenMissing]);

  // Update markers and heatmap data
  useEffect(() => {
    if (!providerRef.current || !managerRef.current) return;
    const map = providerRef.current.getMap();

    const updateMap = () => {
      if (!map.getSource("heatmap-source")) {
        map.addSource("heatmap-source", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        });

        map.addLayer({
          id: "heatmap-layer",
          type: "heatmap",
          source: "heatmap-source",
          layout: { visibility: heatmapActive ? "visible" : "none" },
          paint: {
            "heatmap-weight": ["get", "intensity"],
            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              5, 1,
              12, 3,
            ],
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0, "rgba(0,0,0,0)",
              0.1, "hsla(210, 80%, 60%, 0.3)",
              0.3, "hsla(195, 70%, 50%, 0.5)",
              0.5, "hsla(45, 95%, 55%, 0.6)",
              0.7, "hsla(30, 90%, 55%, 0.7)",
              1, "hsla(0, 85%, 55%, 0.85)",
            ],
            "heatmap-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              5, 30,
              10, 50,
              14, 80,
            ],
            "heatmap-opacity": 0.8,
          },
        });
      }

      // Update heatmap source
      const source = map.getSource("heatmap-source");
      if (source) {
        source.setData({
          type: "FeatureCollection",
          features: events
            .filter((e) => e.lat && e.lng)
            .map((e) => ({
              type: "Feature",
              geometry: { type: "Point", coordinates: [e.lng, e.lat] },
              properties: { intensity: e.severityLevel / 4 },
            })),
        });
      }

      // Build markers with tweet card tooltips
      const managerMarkers = events
        .filter((e) => e.lat && e.lng)
        .map((event, index) => {
          const severity = event.severity || "low";
          const pinColor = SEVERITY_COLORS[severity] || "#3b82f6";
          const pinBg = SEVERITY_PIN_BG[severity] || "#3b82f666";

          return {
            id: event.id,
            rank: event.severityLevel || 1,
            lat: event.lat,
            lng: event.lng,
            pin: {
              element: createPinElement(severity),
              dimensions: { radius: 10, stroke: 2 },
              style: {
                stroke: "#ffffff",
                background: pinBg,
              },
            },
            tooltip: {
              element: createTooltipElement(event),
              dimensions: {
                width: 210,
                height: 130,
                padding: 28,
              },
              style: {
                background: "#0a0a0a",
                radius: 10,
                filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.4))",
              },
            },
            popup: {
              element: createPopupElement(event),
              dimensions: {
                width: 300,
                height: 240,
                padding: 8,
              },
              style: {
                background: "#0a0a0a",
                radius: 12,
              },
            },
          };
        });

      managerRef.current.updateMarkers(managerMarkers);
    };

    if (map.isStyleLoaded()) {
      updateMap();
    }
    
    map.on("style.load", updateMap);

    return () => {
      map.off("style.load", updateMap);
    };
  }, [events, tokenMissing, heatmapActive, isDarkMode]);

  // Fly to selected event
  useEffect(() => {
    if (!providerRef.current || !selectedEvent?.lat || !selectedEvent?.lng)
      return;
    const map = providerRef.current.getMap();

    map.flyTo({
      center: [selectedEvent.lng, selectedEvent.lat],
      zoom: 10,
      duration: 1500,
      essential: true,
    });
  }, [selectedEvent, tokenMissing]);

  return (
    <div className="livemap-container">
      <div
        ref={mapContainer}
        id="live-map"
        style={{ width: "100%", height: "100%" }}
      />

      {tokenMissing && (
        <div
          className="map-overlay"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            zIndex: 1000,
            textAlign: "center",
          }}
        >
          <p>Set VITE_ARENARIUM_TOKEN in a .env file to load the map.</p>
          <p>Example: VITE_ARENARIUM_TOKEN=your_token_here</p>
        </div>
      )}
    </div>
  );
}
