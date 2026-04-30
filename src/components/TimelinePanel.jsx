import { useEffect, useState, useRef, useMemo } from 'react';
import { fetchTrends } from '../utils/api';
import './TimelinePanel.css';

export default function TimelinePanel({ onClose, onTimeRangeChange, events, feedOpen }) {
  const [trendData, setTrendData] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(100);
  const animRef = useRef(null);

  useEffect(() => {
    fetchTrends(48).then(data => {
      setTrendData(data);
    });
  }, [events.length]);

  useEffect(() => {
    if (!playing) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    let value = 0;
    const step = () => {
      value += 0.3;
      if (value > 100) {
        value = 100;
        setPlaying(false);
      }
      setSliderValue(value);
      applyTimeRange(value);
      if (value < 100) {
        animRef.current = requestAnimationFrame(step);
      }
    };
    animRef.current = requestAnimationFrame(step);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [playing]);

  const applyTimeRange = (value) => {
    if (trendData.length === 0) return;
    const endIdx = Math.floor((value / 100) * (trendData.length - 1));
    const endTime = new Date(trendData[endIdx]?.time).getTime();
    const startTime = new Date(trendData[0]?.time).getTime();
    onTimeRangeChange?.(startTime, endTime);
  };

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
    applyTimeRange(val);
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
          className="tl-play"
          onClick={() => {
            if (sliderValue >= 100) setSliderValue(0);
            setPlaying(!playing);
          }}
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
              return (
                <div
                  key={i}
                  className={`tl-bar-wrap`}
                  onClick={() => handleBarClick(i)}
                >
                  <div
                    className={`tl-bar ${isVisible ? '' : 'tl-bar-dim'}`}
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
                  <span className="tl-label">{d.hour}:00</span>
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
