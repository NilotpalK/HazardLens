import { useState, useEffect, useRef } from 'react';
import { DISASTER_TYPES, timeAgo } from '../utils/api';
import './TweetFeed.css';

function TweetCard({ event, onSelectEvent, delay }) {
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <div
      className={`tweet-card ${event.severity}-border`}
      onClick={() => onSelectEvent?.(event)}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="tweet-header">
        <span className="tweet-handle">{event.handle}</span>
        <span className="tweet-time">{timeAgo(event.timestamp)}</span>
      </div>
      <div className="tweet-text">
        {showTranslation ? event.translatedText : event.text}
      </div>
      <div className="tweet-meta">
        <span className={`severity-badge ${event.severity}`}>
          {event.severity}
        </span>
        <span className="disaster-badge">
          {DISASTER_TYPES[event.disasterType]?.icon} {DISASTER_TYPES[event.disasterType]?.label}
        </span>
        {event.locationName && (
          <span className="tweet-location">📍 {event.locationName}</span>
        )}
        {event.translatedText && (
          <button 
            className="translate-btn" 
            onClick={(e) => { e.stopPropagation(); setShowTranslation(!showTranslation); }}
          >
            {showTranslation ? "Show Original" : "Translate"}
          </button>
        )}
        <span className="tweet-source" style={{ marginLeft: "auto" }}>
          {event.source === 'twitter' ? '𝕏' : '🔗'} {event.source}
        </span>
      </div>
    </div>
  );
}

export default function TweetFeed({ events, onSelectEvent }) {
  const [filter, setFilter] = useState('all');
  const [isOpen, setIsOpen] = useState(true);
  const listRef = useRef(null);

  const filtered = filter === 'all'
    ? events
    : events.filter(e => e.disasterType === filter);

  const sorted = [...filtered].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Auto-scroll to top on new events
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [events.length]);

  return (
    <div className={`tweet-feed glass-panel ${!isOpen ? 'collapsed' : ''}`} id="tweet-feed">
      <div className="feed-header" onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        <div className="feed-title">
          📡 Live Feed
          <span className="feed-count">{sorted.length}</span>
        </div>
        <button className="feed-close-btn" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          {isOpen ? '▼' : '▲'}
        </button>
      </div>

      {isOpen && (
        <>
          <div className="feed-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        {Object.entries(DISASTER_TYPES).filter(([k]) => k !== 'other').map(([key, config]) => (
          <button
            key={key}
            className={`filter-btn ${filter === key ? 'active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {config.icon} {config.label}
          </button>
        ))}
      </div>

      <div className="feed-list" ref={listRef}>
        {sorted.slice(0, 100).map((event, i) => (
          <TweetCard 
            key={event.id} 
            event={event} 
            onSelectEvent={onSelectEvent} 
            delay={Math.min(i * 0.03, 0.3)} 
          />
        ))}
          </div>
        </>
      )}
    </div>
  );
}
