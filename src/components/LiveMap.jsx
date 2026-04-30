import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { DISASTER_TYPES, timeAgo } from '../utils/api';
import './LiveMap.css';

const NE_INDIA_CENTER = [92.5, 26.0];

// Free dark vector tile style (CartoDB Dark Matter via Positron/DarkMatter raster)
const MAP_STYLE = {
  version: 8,
  name: 'Dark',
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>',
    },
  },
  layers: [
    {
      id: 'carto-dark-layer',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

export default function LiveMap({ events, heatmapActive, selectedEvent }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef({});

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: NE_INDIA_CENTER,
      zoom: 6.5,
      maxBounds: [[82, 18], [102, 33]],
      pitch: 0,
      antialias: true,
    });

    map.current.addControl(
      new maplibregl.NavigationControl({ showCompass: false }),
      'bottom-left'
    );

    map.current.on('load', () => {
      // Add heatmap GeoJSON source
      map.current.addSource('heatmap-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      // Native heatmap layer
      map.current.addLayer({
        id: 'heatmap-layer',
        type: 'heatmap',
        source: 'heatmap-source',
        layout: { visibility: 'none' },
        paint: {
          'heatmap-weight': ['get', 'intensity'],
          'heatmap-intensity': [
            'interpolate', ['linear'], ['zoom'],
            5, 1, 12, 3,
          ],
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            0.1, 'hsla(210, 80%, 60%, 0.3)',
            0.3, 'hsla(195, 70%, 50%, 0.5)',
            0.5, 'hsla(45, 95%, 55%, 0.6)',
            0.7, 'hsla(30, 90%, 55%, 0.7)',
            1, 'hsla(0, 85%, 55%, 0.85)',
          ],
          'heatmap-radius': [
            'interpolate', ['linear'], ['zoom'],
            5, 30, 10, 50, 14, 80,
          ],
          'heatmap-opacity': 0.8,
        },
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Toggle heatmap visibility
  useEffect(() => {
    if (!map.current) return;
    const setVisibility = () => {
      try {
        if (map.current.getLayer('heatmap-layer')) {
          map.current.setLayoutProperty(
            'heatmap-layer',
            'visibility',
            heatmapActive ? 'visible' : 'none'
          );
        }
      } catch (e) { /* layer may not exist yet */ }
    };
    if (map.current.isStyleLoaded()) {
      setVisibility();
    } else {
      map.current.once('load', setVisibility);
    }
  }, [heatmapActive]);

  // Update markers and heatmap data
  useEffect(() => {
    if (!map.current) return;

    const updateMap = () => {
      // Update heatmap source
      const source = map.current.getSource('heatmap-source');
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features: events.filter(e => e.lat && e.lng).map(e => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [e.lng, e.lat] },
            properties: { intensity: e.severityLevel / 4 },
          })),
        });
      }

      // Manage markers
      const currentIds = new Set(events.map(e => e.id));

      // Remove old markers
      for (const [id, marker] of Object.entries(markersRef.current)) {
        if (!currentIds.has(id)) {
          marker.remove();
          delete markersRef.current[id];
        }
      }

      // Add new markers
      for (const event of events) {
        if (!event.lat || !event.lng || markersRef.current[event.id]) continue;

        const el = document.createElement('div');
        el.className = `disaster-marker ${event.severity}-marker`;
        el.title = `${DISASTER_TYPES[event.disasterType]?.icon || '⚠️'} ${event.locationName || 'Unknown'}`;

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([event.lng, event.lat])
          .setPopup(
            new maplibregl.Popup({ offset: 15, closeButton: true, maxWidth: '300px' })
              .setHTML(`
                <div class="popup-content">
                  <div class="popup-header">
                    <span class="popup-type">${DISASTER_TYPES[event.disasterType]?.icon || '⚠️'} ${DISASTER_TYPES[event.disasterType]?.label || 'Unknown'}</span>
                    <span class="severity-badge ${event.severity}">${event.severity}</span>
                  </div>
                  <div class="popup-text">${event.text.substring(0, 200)}${event.text.length > 200 ? '...' : ''}</div>
                  <div class="popup-meta">
                    <span class="popup-location">📍 ${event.locationName || 'Unknown'}${event.state ? ', ' + event.state : ''}</span>
                    <span class="popup-time">${timeAgo(event.timestamp)}</span>
                  </div>
                </div>
              `)
          )
          .addTo(map.current);

        markersRef.current[event.id] = marker;
      }
    };

    if (map.current.isStyleLoaded()) {
      updateMap();
    } else {
      map.current.once('load', updateMap);
    }
  }, [events]);

  // Fly to selected event
  useEffect(() => {
    if (!map.current || !selectedEvent?.lat || !selectedEvent?.lng) return;

    map.current.flyTo({
      center: [selectedEvent.lng, selectedEvent.lat],
      zoom: 10,
      duration: 1500,
      essential: true,
    });

    // Open popup
    const marker = markersRef.current[selectedEvent.id];
    if (marker) {
      marker.togglePopup();
    }
  }, [selectedEvent]);

  return <div ref={mapContainer} className="livemap-container" id="live-map" />;
}
