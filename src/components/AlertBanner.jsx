import { useEffect, useState } from 'react';
import { DISASTER_TYPES } from '../utils/api';
import './AlertBanner.css';

export default function AlertBanner({ event, onDismiss, onSelect }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!event) return;
    setVisible(true);

    // Send browser notification
    if (Notification.permission === 'granted') {
      try {
        new Notification('🚨 HazardLens Critical Alert', {
          body: `${DISASTER_TYPES[event.disasterType]?.icon} ${event.text.substring(0, 100)}`,
          icon: '/favicon.svg',
          tag: event.id,
        });
      } catch (e) { /* notifications may fail in some contexts */ }
    }

    // Auto-dismiss after 12 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss?.(), 300);
    }, 12000);

    return () => clearTimeout(timer);
  }, [event?.id]);

  if (!event || !visible) return null;

  return (
    <div
      className="alert-banner"
      onClick={() => onSelect?.(event)}
      id="alert-banner"
    >
      <div className="alert-icon">🚨</div>
      <div className="alert-content">
        <div className="alert-title">
          CRITICAL: {DISASTER_TYPES[event.disasterType]?.label || 'Disaster'} detected in {event.locationName || 'NE India'}
        </div>
        <div className="alert-text">{event.text}</div>
      </div>
      <button className="alert-dismiss" onClick={(e) => { e.stopPropagation(); setVisible(false); onDismiss?.(); }}>✕</button>
    </div>
  );
}
