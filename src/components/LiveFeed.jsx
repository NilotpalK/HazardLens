import { useEffect, useRef } from 'react';
import { DISASTER_TYPES, timeAgo } from '../utils/api';
import './LiveFeed.css';

export default function LiveFeed({ events, onSelectEvent, onClose }) {
  const listRef = useRef(null);
  const sorted = [...events].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [events.length]);

  return (
    <div className="live-feed">
      <div className="feed-header">
        <span className="feed-header-dot" />
        <span className="feed-header-title">Live Feed</span>
        <span className="feed-header-count">{sorted.length}</span>
        <button className="feed-header-close" onClick={onClose}>✕</button>
      </div>

      <div className="feed-list" ref={listRef}>
        {sorted.slice(0, 80).map((event) => (
          <div
            key={event.id}
            className="feed-item"
            onClick={() => onSelectEvent?.(event)}
          >
            <div className="feed-item-header">
              <span className={`feed-item-dot ${event.severity}`} />
              <span className="feed-item-handle">{event.handle}</span>
              <span className="feed-item-time">{timeAgo(event.timestamp)}</span>
            </div>
            <div className="feed-item-text">{event.text}</div>
            <div className="feed-item-meta">
              <span className="feed-item-type">
                {DISASTER_TYPES[event.disasterType]?.label || 'Unknown'}
              </span>
              {event.locationName && (
                <>
                  <span className="feed-item-sep">·</span>
                  <span className="feed-item-loc">{event.locationName}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
