import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { fetchTrends } from '../utils/api';
import './TimelinePanel.css';

export default function TimelinePanel({ onClose, onTimeRangeChange, events, feedOpen, autoPlay }) {
  const [trendData, setTrendData] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const intervalRef = useRef(null);
  const autoPlayTriggered = useRef(false);

  useEffect(() => {
    fetchTrends(48).then(data => {
      setTrendData(data);
    });
  }, [events.length]);

  const applyTimeRange = useCallback((value) => {
    if (trendData.length === 0) return;
    const endIdx = Math.floor((value / 100) * (trendData.length - 1));
    const endTime = new Date(trendData[endIdx]?.time).getTime();
    const startTime = new Date(trendData[0]?.time).getTime();
    onTimeRangeChange?.(startTime, endTime);
  }, [trendData, onTimeRangeChange]);

  // Auto-play when timeline opens
  useEffect(() => {
    if (autoPlay && trendData.length > 0 && !autoPlayTriggered.current) {
      autoPlayTriggered.current = true;
      setSliderValue(0);
      applyTimeRange(0);
      // Small delay for the panel animation to complete before playback starts
      const timer = setTimeout(() => {
        setPlaying(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, trendData, applyTimeRange]);

  // Playback engine — step through time buckets at a steady pace
  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Calculate step size: one time bucket per tick
    const stepSize = trendData.length > 0 ? (100 / (trendData.length - 1)) : 1;
    // Tick interval — controls animation speed (lower = faster)
    const tickMs = 120;

    intervalRef.current = setInterval(() => {
      setSliderValue(prev => {
        let next = prev + stepSize;
        if (next >= 100) {
          next = 100;
          // Stop at the end
          setTimeout(() => setPlaying(false), 0);
        }
        applyTimeRange(next);
        return next;
      });
    }, tickMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [playing, trendData, applyTimeRange]);

  const handleBarClick = (index) => {
    if (trendData.length === 0) return;
    const val = (index / (trendData.length - 1)) * 100;
    setSliderValue(val);
    setPlaying(false);
    applyTimeRange(val);
  };

  const handleSliderInput = (e) => {
    const val = Number(e.target.value);
    setSliderValue(val);
    setPlaying(false);
    applyTimeRange(val);
  };

  const handlePlayPause = () => {
    if (playing) {
      setPlaying(false);
    } else {
      // If at the end, restart from beginning
      if (sliderValue >= 100) {
        setSliderValue(0);
        applyTimeRange(0);
      }
      setPlaying(true);
    }
  };

  const currentIdx = Math.floor((sliderValue / 100) * Math.max(trendData.length - 1, 0));
  const currentTime = trendData[currentIdx]?.time;

  const maxTotal = useMemo(() => {
    if (!trendData.length) return 1;
    return Math.max(...trendData.map(d =>
      (d.flood || 0) + (d.landslide || 0) + (d.heavy_rain || 0) + (d.infrastructure || 0)
    ), 1);
  }, [trendData]);

  // Show time labels every N bars depending on data length
  const labelInterval = trendData.length > 24 ? 6 : 3;

  return (
    <div className="timeline-panel" id="timeline-panel" style={{ right: feedOpen ? '340px' : '0' }}>
      <div className="tl-row">
        <button
          className={`tl-play ${playing ? 'tl-play-active' : ''}`}
          onClick={handlePlayPause}
        >
          {playing ? '⏸' : '▶'}
        </button>

        <div className="tl-body">
          {/* Heatmap bars */}
          <div className="tl-heatmap">
            {trendData.map((d, i) => {
              const total = (d.flood || 0) + (d.landslide || 0) + (d.heavy_rain || 0) + (d.infrastructure || 0);
              const intensity = total / maxTotal;
              const isVisible = i <= currentIdx;
              const isCurrent = i === currentIdx;
              return (
                <div
                  key={i}
                  className={`tl-bar-wrap`}
                  onClick={() => handleBarClick(i)}
                >
                  <div
                    className={`tl-bar ${isVisible ? '' : 'tl-bar-dim'} ${isCurrent && playing ? 'tl-bar-pulse' : ''}`}
                    style={{
                      height: `${Math.max(intensity * 100, 6)}%`,
                      opacity: isVisible ? (0.3 + intensity * 0.7) : 0.08,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Time labels below */}
          <div className="tl-labels">
            {trendData.map((d, i) => (
              <div key={i} className="tl-label-slot">
                {i % labelInterval === 0 && (
                  <span className={`tl-label ${i <= currentIdx ? 'tl-label-active' : ''}`}>{d.hour}:00</span>
                )}
              </div>
            ))}
          </div>

          {/* Slider */}
          <input
            type="range"
            className="tl-slider"
            min="0"
            max="100"
            step="0.5"
            value={sliderValue}
            onChange={handleSliderInput}
          />
        </div>

        <div className="tl-info">
          <span className="tl-time">
            {currentTime ? new Date(currentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
          </span>
          <button className="tl-close" onClick={onClose}>✕</button>
        </div>
      </div>
    </div>
  );
}
