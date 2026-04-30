import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapManager } from "@arenarium/maps";
import { MaplibreProvider, MaplibreLightStyle, MaplibreDarkStyle } from "@arenarium/maps-integration-maplibre";
import "@arenarium/maps/style.css";
import { DISASTER_TYPES, timeAgo } from "../utils/api";
import "./LiveMap.css";

const NE_INDIA_CENTER = [92.5, 26.0];



const createPinElement = (severity) => {
  const el = document.createElement("div");
  el.className = `disaster-marker ${severity}-marker`;
  el.style.width = "100%";
  el.style.height = "100%";
  return el;
};

const createTooltipElement = (icon, locationName) => {
  const element = document.createElement("div");
  element.style.cssText =
    "width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; white-space: nowrap;";
  element.textContent = `${icon || "⚠️"} ${locationName || "Unknown"}`;
  return element;
};

const createPopupElement = (event) => {
  const element = document.createElement("div");
  element.style.cssText = "width: 100%; height: 100%;";
  element.innerHTML = `
    <div class="popup-content">
      <div class="popup-header">
        <span class="popup-type">${DISASTER_TYPES[event.disasterType]?.icon || "⚠️"} ${DISASTER_TYPES[event.disasterType]?.label || "Unknown"}</span>
        <span class="severity-badge ${event.severity}">${event.severity}</span>
      </div>
      <div class="popup-text">${event.text.substring(0, 200)}${event.text.length > 200 ? "..." : ""}</div>
      <div class="popup-meta">
        <span class="popup-location">📍 ${event.locationName || "Unknown"}${event.state ? ", " + event.state : ""}</span>
        <span class="popup-time">${timeAgo(event.timestamp)}</span>
      </div>
    </div>
  `;
  return element;
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

        if (providerRef.current) return; // Already initialized

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
              5,
              1,
              12,
              3,
            ],
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(0,0,0,0)",
              0.1,
              "hsla(210, 80%, 60%, 0.3)",
              0.3,
              "hsla(195, 70%, 50%, 0.5)",
              0.5,
              "hsla(45, 95%, 55%, 0.6)",
              0.7,
              "hsla(30, 90%, 55%, 0.7)",
              1,
              "hsla(0, 85%, 55%, 0.85)",
            ],
            "heatmap-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              5,
              30,
              10,
              50,
              14,
              80,
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

      // Update markers via MapManager
      const managerMarkers = events
        .filter((e) => e.lat && e.lng)
        .map((event) => {
          return {
            id: event.id,
            rank: event.severityLevel || 1,
            lat: event.lat,
            lng: event.lng,
            tooltip: {
              element: createTooltipElement(
                DISASTER_TYPES[event.disasterType]?.icon,
                event.locationName,
              ),
              dimensions: { height: 24, width: 100, padding: 4 },
              style: {
                background: "rgba(0,0,0,0.7)",
                radius: 4,
              },
            },
            pin: {
              element: createPinElement(event.severity),
              dimensions: { radius: 12, stroke: 0 },
              style: { background: "transparent" },
            },
            popup: {
              element: createPopupElement(event),
              dimensions: { height: 150, width: 300, padding: 0 },
              style: {
                background: "transparent",
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
  }, [events, tokenMissing, heatmapActive]);

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
