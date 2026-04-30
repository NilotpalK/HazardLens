import { useEffect, useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchTrends } from '../utils/api';
import './TimelinePanel.css';

const CHART_COLORS = {
  flood: 'hsl(210, 80%, 60%)',
  landslide: 'hsl(25, 75%, 55%)',
  heavy_rain: 'hsl(195, 70%, 50%)',
  infrastructure: 'hsl(280, 60%, 60%)',
};

export default function TimelinePanel({ onClose, onTimeRangeChange, events }) {
  const [trendData, setTrendData] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(100);
  const animRef = useRef(null);

  useEffect(() => {
    fetchTrends(48).then(data => {
      setTrendData(data);
    });
  }, [events.length]);

  // Playback animation
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
      handleSliderChange(value);
      if (value < 100) {
        animRef.current = requestAnimationFrame(step);
      }
    };
    animRef.current = requestAnimationFrame(step);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [playing]);

  const handleSliderChange = (value) => {
    if (trendData.length === 0) return;
    const endIdx = Math.floor((value / 100) * (trendData.length - 1));
    const endTime = new Date(trendData[endIdx]?.time).getTime();
    const startTime = new Date(trendData[0]?.time).getTime();
    onTimeRangeChange?.(startTime, endTime);
  };

  const handleSliderInput = (e) => {
    const val = Number(e.target.value);
    setSliderValue(val);
    handleSliderChange(val);
  };

  const currentIdx = Math.floor((sliderValue / 100) * Math.max(trendData.length - 1, 0));
  const currentTime = trendData[currentIdx]?.time;

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: 'hsl(220, 25%, 10%)',
        border: '1px solid hsla(215, 20%, 30%, 0.5)',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 11,
      }}>
        <div style={{ color: 'hsl(215, 15%, 65%)', marginBottom: 4 }}>{label}:00</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color, fontSize: 11 }}>
            {p.name}: {p.value}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="timeline-panel" id="timeline-panel">
      <div className="timeline-header">
        <div className="timeline-title">
          📊 Time-Based Trends & Spread
        </div>
        <div className="timeline-range">
          {currentTime ? new Date(currentTime).toLocaleString() : '—'}
        </div>
        <button className="timeline-close" onClick={onClose}>✕ Close</button>
      </div>

      <div className="timeline-controls">
        <button
          className="timeline-play-btn"
          onClick={() => {
            if (sliderValue >= 100) setSliderValue(0);
            setPlaying(!playing);
          }}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <input
          type="range"
          className="timeline-slider"
          min="0"
          max="100"
          step="0.5"
          value={sliderValue}
          onChange={handleSliderInput}
        />
      </div>

      <div className="timeline-chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData.slice(0, currentIdx + 1)} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              {Object.entries(CHART_COLORS).map(([key, color]) => (
                <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>
            <XAxis dataKey="hour" tick={{ fill: 'hsl(215, 10%, 45%)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'hsl(215, 10%, 45%)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="flood" name="Flood" stroke={CHART_COLORS.flood} fill={`url(#grad-flood)`} strokeWidth={2} />
            <Area type="monotone" dataKey="landslide" name="Landslide" stroke={CHART_COLORS.landslide} fill={`url(#grad-landslide)`} strokeWidth={2} />
            <Area type="monotone" dataKey="heavy_rain" name="Rain" stroke={CHART_COLORS.heavy_rain} fill={`url(#grad-heavy_rain)`} strokeWidth={2} />
            <Area type="monotone" dataKey="infrastructure" name="Infra" stroke={CHART_COLORS.infrastructure} fill={`url(#grad-infrastructure)`} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="trend-legend">
        {Object.entries(CHART_COLORS).map(([key, color]) => (
          <div className="trend-legend-item" key={key}>
            <div className="trend-legend-dot" style={{ background: color }}></div>
            {key === 'heavy_rain' ? 'Rain' : key.charAt(0).toUpperCase() + key.slice(1)}
          </div>
        ))}
      </div>
    </div>
  );
}
