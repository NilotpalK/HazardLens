import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import LiveMap from './components/LiveMap';
import TweetFeed from './components/TweetFeed';
import StatsPanel from './components/StatsPanel';
import AlertBanner from './components/AlertBanner';
import TimelinePanel from './components/TimelinePanel';
import {
  fetchEvents,
  fetchEventsByTime,
  createEventStream,
  startSimulation,
  stopSimulation,
} from './utils/api';

export default function App() {
  const [events, setEvents] = useState([]);
  const [displayEvents, setDisplayEvents] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [heatmapActive, setHeatmapActive] = useState(false);
  const [timelineActive, setTimelineActive] = useState(false);
  const [speed, setSpeed] = useState(8000);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [criticalAlert, setCriticalAlert] = useState(null);
  const [timeRange, setTimeRange] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Load initial events
  useEffect(() => {
    fetchEvents().then(data => {
      setEvents(data);
      setDisplayEvents(data);
    });
  }, []);

  // SSE real-time stream
  useEffect(() => {
    const es = createEventStream((event) => {
      setEvents(prev => {
        const updated = [...prev, event];
        return updated.slice(-500);
      });

      // Show critical alerts
      if (event.severity === 'critical') {
        setCriticalAlert(event);
      }
    });

    return () => es.close();
  }, []);

  // Update display events (live vs historical)
  useEffect(() => {
    if (!timeRange) {
      setDisplayEvents(events);
    }
  }, [events, timeRange]);

  // Handle time range from timeline
  const handleTimeRangeChange = useCallback((start, end) => {
    setTimeRange({ start, end });
    const filtered = events.filter(e => {
      const t = new Date(e.timestamp).getTime();
      return t >= start && t <= end;
    });
    setDisplayEvents(filtered);
  }, [events]);

  // Toggle simulation
  const handleToggleLive = async () => {
    if (isLive) {
      await stopSimulation();
      setIsLive(false);
    } else {
      await startSimulation(speed);
      setIsLive(true);
    }
  };

  // Change simulation speed
  const handleSpeedChange = async (newSpeed) => {
    setSpeed(newSpeed);
    if (isLive) {
      await startSimulation(newSpeed);
    }
  };

  // Toggle timeline
  const handleToggleTimeline = () => {
    setTimelineActive(!timelineActive);
    if (timelineActive) {
      setTimeRange(null);
      setDisplayEvents(events);
    }
  };

  return (
    <div id="app">
      <Navbar
        isLive={isLive}
        onToggleLive={handleToggleLive}
        heatmapActive={heatmapActive}
        onToggleHeatmap={() => setHeatmapActive(!heatmapActive)}
        onSpeedChange={handleSpeedChange}
        speed={speed}
        timelineActive={timelineActive}
        onToggleTimeline={handleToggleTimeline}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      <LiveMap
        events={displayEvents}
        heatmapActive={heatmapActive}
        selectedEvent={selectedEvent}
        isDarkMode={isDarkMode}
      />

      <StatsPanel events={displayEvents} />

      <TweetFeed
        events={displayEvents}
        onSelectEvent={(event) => setSelectedEvent(event)}
      />

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

      {timelineActive && (
        <TimelinePanel
          events={events}
          onClose={() => {
            setTimelineActive(false);
            setTimeRange(null);
            setDisplayEvents(events);
          }}
          onTimeRangeChange={handleTimeRangeChange}
        />
      )}
    </div>
  );
}
