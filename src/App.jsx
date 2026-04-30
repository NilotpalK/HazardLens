import { useState, useEffect, useCallback } from "react";
import LiveMap from "./components/LiveMap";
import LiveFeed from "./components/LiveFeed";
import AlertBanner from "./components/AlertBanner";
import TimelinePanel from "./components/TimelinePanel";
import AddTweetModal from "./components/AddTweetModal";
import {
  fetchEvents,
  createEventStream,
  startSimulation,
  stopSimulation,
} from "./utils/api";
import "./components/ControlBar.css";

export default function App() {
  const [events, setEvents] = useState([]);
  const [displayEvents, setDisplayEvents] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [heatmapActive, setHeatmapActive] = useState(false);
  const [speed, setSpeed] = useState(8000);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [criticalAlert, setCriticalAlert] = useState(null);
  const [timelineActive, setTimelineActive] = useState(false);
  const [timeRange, setTimeRange] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feedOpen, setFeedOpen] = useState(false);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    fetchEvents().then((data) => {
      setEvents(data);
      setDisplayEvents(data);
    });
  }, []);

  useEffect(() => {
    const es = createEventStream((event) => {
      setEvents((prev) => {
        const updated = [...prev, event];
        return updated.slice(-500);
      });

      if (event.severity === "critical") {
        setCriticalAlert(event);
      }
    });

    return () => es.close();
  }, []);

  useEffect(() => {
    if (!timeRange) {
      setDisplayEvents(events);
    }
  }, [events, timeRange]);

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

  const handleTimeRangeChange = useCallback(
    (start, end) => {
      setTimeRange({ start, end });
      const filtered = events.filter((e) => {
        const t = new Date(e.timestamp).getTime();
        return t >= start && t <= end;
      });
      setDisplayEvents(filtered);
    },
    [events],
  );

  const handleToggleTimeline = () => {
    setTimelineActive(!timelineActive);
    if (timelineActive) {
      setTimeRange(null);
      setDisplayEvents(events);
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

      {feedOpen && (
        <LiveFeed
          events={displayEvents}
          onSelectEvent={(event) => setSelectedEvent(event)}
          onClose={() => setFeedOpen(false)}
        />
      )}

      {/* Floating bottom control bar — lifts above timeline */}
      <div
        className={`control-bar ${timelineActive ? "control-bar-lifted" : ""}`}
      >
        <div className="control-bar-inner">
          <button
            className={`cb-btn ${isLive ? "cb-active" : ""}`}
            onClick={handleToggleLive}
          >
            {isLive ? "Live" : "Paused"}
          </button>
          <button
            className={`cb-btn ${heatmapActive ? "cb-active" : ""}`}
            onClick={() => setHeatmapActive(!heatmapActive)}
          >
            Heatmap
          </button>
          <button
            className={`cb-btn ${feedOpen ? "cb-active" : ""}`}
            onClick={() => setFeedOpen(!feedOpen)}
          >
            Feed
          </button>
          <button
            className={`cb-btn ${timelineActive ? "cb-active" : ""}`}
            onClick={handleToggleTimeline}
          >
            Timeline
          </button>
          <button
            className={`cb-btn ${isAddModalOpen ? "cb-active" : ""}`}
            onClick={() => setIsAddModalOpen(true)}
          >
            Report
          </button>
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

      {timelineActive && (
        <TimelinePanel
          events={events}
          feedOpen={feedOpen}
          onClose={() => {
            setTimelineActive(false);
            setTimeRange(null);
            setDisplayEvents(events);
          }}
          onTimeRangeChange={handleTimeRangeChange}
        />
      )}

      {isAddModalOpen && (
        <AddTweetModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
}
