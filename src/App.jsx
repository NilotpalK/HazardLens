import { useState, useEffect } from 'react';
import LiveMap from './components/LiveMap';
import LiveFeed from './components/LiveFeed';
import AlertBanner from './components/AlertBanner';
import {
  fetchEvents,
  createEventStream,
  startSimulation,
  stopSimulation,
} from './utils/api';
import './components/ControlBar.css';

export default function App() {
  const [events, setEvents] = useState([]);
  const [displayEvents, setDisplayEvents] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [heatmapActive, setHeatmapActive] = useState(false);
  const [speed, setSpeed] = useState(8000);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [criticalAlert, setCriticalAlert] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    fetchEvents().then(data => {
      setEvents(data);
      setDisplayEvents(data);
    });
  }, []);

  useEffect(() => {
    const es = createEventStream((event) => {
      setEvents(prev => {
        const updated = [...prev, event];
        return updated.slice(-500);
      });

      if (event.severity === 'critical') {
        setCriticalAlert(event);
      }
    });

    return () => es.close();
  }, []);

  useEffect(() => {
    setDisplayEvents(events);
  }, [events]);

  const handleToggleLive = async () => {
    if (isLive) {
      await stopSimulation();
      setIsLive(false);
    } else {
      await startSimulation(speed);
      setIsLive(true);
    }
  };

  const handleSpeedChange = async (newSpeed) => {
    setSpeed(newSpeed);
    if (isLive) {
      await startSimulation(newSpeed);
    }
  };

  return (
    <div id="app">
      <LiveMap
        events={displayEvents}
        heatmapActive={heatmapActive}
        selectedEvent={selectedEvent}
        isDarkMode={isDarkMode}
      />

      <LiveFeed
        events={displayEvents}
        onSelectEvent={(event) => setSelectedEvent(event)}
      />

      {/* Floating bottom control bar */}
      <div className="control-bar">
        <div className="control-bar-inner">
          <button
            className={`cb-btn ${isLive ? 'cb-active' : ''}`}
            onClick={handleToggleLive}
          >
            {isLive ? 'Live' : 'Paused'}
          </button>
          <button
            className={`cb-btn ${heatmapActive ? 'cb-active' : ''}`}
            onClick={() => setHeatmapActive(!heatmapActive)}
          >
            Heatmap
          </button>
          <select
            className="cb-select"
            value={speed}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
          >
            <option value={3000}>Fast</option>
            <option value={5000}>Medium</option>
            <option value={8000}>Normal</option>
            <option value={15000}>Slow</option>
          </select>
        </div>
      </div>

      {criticalAlert && (
        <AlertBanner
          event={criticalAlert}
          onDismiss={() => setCriticalAlert(null)}
          onSelect={(event) => {
            setSelectedEvent(event);
            setCriticalAlert(null);
          }}
        />
      )}
    </div>
  );
}
