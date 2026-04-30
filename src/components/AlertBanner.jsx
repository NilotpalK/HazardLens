import { useEffect, useState } from 'react';
import { DISASTER_TYPES, timeAgo } from '../utils/api';
import './AlertBanner.css';

export default function AlertBanner({ event, onDismiss, onSelect }) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!event) return;
    setVisible(true);
    setExpanded(false);

    if (Notification.permission === 'granted') {
      try {
        new Notification('HazardLens Alert', {
          body: `${event.locationName || 'NE India'} · ${event.text.substring(0, 100)}`,
          icon: '/favicon.svg',
          tag: event.id,
        });
      } catch (e) { /* */ }
    }

    const timer = setTimeout(() => {
      if (!expanded) {
        setVisible(false);
        setTimeout(() => onDismiss?.(), 300);
      }
    }, 12000);

    return () => clearTimeout(timer);
  }, [event?.id]);

  if (!event || !visible) return null;

  const engagement = event.engagement || {};
  const relevancy = event.relevancyScore ? Math.round(event.relevancyScore * 100) : null;

  const handleClick = (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <div
      className={`alert-banner ${expanded ? 'alert-expanded' : ''}`}
      onClick={handleClick}
      id="alert-banner"
    >
      <div className="alert-row">
        <div className="alert-icon" />
        <div className="alert-content">
          <div className="alert-title">
            {event.locationName || 'NE India'} · {DISASTER_TYPES[event.disasterType]?.label || 'Alert'}
          </div>
          <div className="alert-text">{event.text}</div>
        </div>
        <button className="alert-dismiss" onClick={(e) => { e.stopPropagation(); setVisible(false); onDismiss?.(); }}>✕</button>
      </div>

      {expanded && (
        <div className="alert-details">
          <div className="alert-detail-row">
            <span className="alert-detail-label">Severity</span>
            <span className={`alert-detail-value alert-sev-${event.severity}`}>{event.severity}</span>
          </div>
          <div className="alert-detail-row">
            <span className="alert-detail-label">Source</span>
            <span className="alert-detail-value">{event.handle || '@unknown'}</span>
          </div>
          <div className="alert-detail-row">
            <span className="alert-detail-label">Time</span>
            <span className="alert-detail-value alert-mono">{timeAgo(event.timestamp)}</span>
          </div>
          {relevancy && (
            <div className="alert-detail-row">
              <span className="alert-detail-label">Relevancy</span>
              <span className="alert-detail-value">{relevancy}%</span>
            </div>
          )}
          <div className="alert-detail-row">
            <span className="alert-detail-label">Engagement</span>
            <span className="alert-detail-value alert-mono">
              {engagement.likes || 0} likes · {engagement.retweets || 0} rt · {engagement.replies || 0} replies
            </span>
          </div>
          <button
            className="alert-locate-btn"
            onClick={(e) => { e.stopPropagation(); onSelect?.(event); }}
          >
            Locate on map
          </button>
        </div>
      )}
    </div>
  );
}
