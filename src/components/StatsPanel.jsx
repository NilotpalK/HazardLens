import { useEffect, useState } from 'react';
import { fetchStats, DISASTER_TYPES } from '../utils/api';
import './StatsPanel.css';

export default function StatsPanel({ events }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats().then(setStats);
    const interval = setInterval(() => fetchStats().then(setStats), 5000);
    return () => clearInterval(interval);
  }, []);

  // Also recompute when events change
  useEffect(() => {
    fetchStats().then(setStats);
  }, [events.length]);

  if (!stats) return null;

  return (
    <div className="stats-panel" id="stats-panel">
      <div className="stat-card glass-panel">
        <div className="stat-label">Total Events</div>
        <div className="stat-value accent-text">{stats.total}</div>
        <div className="stat-sub">Last 24h: {stats.last24h}</div>
      </div>

      <div className="stat-card glass-panel">
        <div className="stat-label">Severity</div>
        <div className="severity-dots">
          <div className="sev-dot">
            <span className="sev-dot-indicator critical"></span>
            <span style={{ color: 'var(--critical)' }}>{stats.bySeverity.critical}</span>
          </div>
          <div className="sev-dot">
            <span className="sev-dot-indicator high"></span>
            <span style={{ color: 'var(--high)' }}>{stats.bySeverity.high}</span>
          </div>
          <div className="sev-dot">
            <span className="sev-dot-indicator moderate"></span>
            <span style={{ color: 'var(--moderate)' }}>{stats.bySeverity.moderate}</span>
          </div>
          <div className="sev-dot">
            <span className="sev-dot-indicator low"></span>
            <span style={{ color: 'var(--low)' }}>{stats.bySeverity.low}</span>
          </div>
        </div>
      </div>

      <div className="stat-card glass-panel">
        <div className="stat-label">Most Affected</div>
        <div className="stat-value" style={{ fontSize: 16, textTransform: 'capitalize' }}>
          {stats.mostAffected?.name || '—'}
        </div>
        <div className="stat-sub">{stats.mostAffected?.count || 0} reports</div>
      </div>

      <div className="stat-card glass-panel">
        <div className="stat-label">By Type</div>
        <div className="severity-dots" style={{ flexWrap: 'wrap' }}>
          {Object.entries(stats.byType || {}).map(([type, count]) => (
            <div className="sev-dot" key={type}>
              <span>{DISASTER_TYPES[type]?.icon || '⚠️'}</span>
              <span style={{ color: DISASTER_TYPES[type]?.color }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
