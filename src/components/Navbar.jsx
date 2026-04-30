import { useState } from 'react';
import './Navbar.css';

export default function Navbar({ isLive, onToggleLive, onToggleHeatmap, heatmapActive, onSpeedChange, speed, onToggleTimeline, timelineActive, isDarkMode, onToggleTheme, onOpenAddModal }) {
  return (
    <nav className="navbar" id="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">🔴</div>
        <div>
          <div className="navbar-title">HazardLens</div>
          <div className="navbar-subtitle">NE India Disaster Intelligence</div>
        </div>
      </div>

      <div className="navbar-status">
        <div className="live-indicator">
          <span className={`live-dot ${!isLive ? 'paused' : ''}`}></span>
          {isLive ? 'LIVE' : 'PAUSED'}
        </div>

        <div className="navbar-controls">
          <button className="nav-btn" onClick={onToggleLive} id="btn-toggle-live">
            <span className="icon">{isLive ? '⏸' : '▶️'}</span>
            {isLive ? 'Pause' : 'Resume'}
          </button>

          <button className={`nav-btn ${heatmapActive ? 'active' : ''}`} onClick={onToggleHeatmap} id="btn-toggle-heatmap">
            <span className="icon">🔥</span>
            Heatmap
          </button>

          <button className={`nav-btn ${timelineActive ? 'active' : ''}`} onClick={onToggleTimeline} id="btn-toggle-timeline">
            <span className="icon">📊</span>
            Timeline
          </button>

          <button className="nav-btn" onClick={onToggleTheme} id="btn-toggle-theme">
            <span className="icon">{isDarkMode ? '☀️' : '🌙'}</span>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>

          <button className="nav-btn" onClick={onOpenAddModal} id="btn-add-tweet" style={{ background: 'var(--accent)', color: 'white', border: 'none' }}>
            <span className="icon">➕</span>
            Report
          </button>

          <select className="speed-select" value={speed} onChange={(e) => onSpeedChange(Number(e.target.value))} id="speed-select">
            <option value={3000}>Fast (3s)</option>
            <option value={5000}>Medium (5s)</option>
            <option value={8000}>Normal (8s)</option>
            <option value={15000}>Slow (15s)</option>
          </select>
        </div>
      </div>
    </nav>
  );
}
