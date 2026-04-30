// In-memory event store with aggregation methods

class EventStore {
  constructor(maxEvents = 500) {
    this.events = [];
    this.maxEvents = maxEvents;
  }

  add(event) {
    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
    return event;
  }

  getAll() {
    return this.events;
  }

  getRecent(count = 50) {
    return this.events.slice(-count);
  }

  getByTimeRange(startTime, endTime) {
    return this.events.filter((e) => {
      const t = new Date(e.timestamp).getTime();
      return t >= startTime && t <= endTime;
    });
  }

  getStats() {
    const now = Date.now();
    const last24h = this.events.filter(
      (e) => now - new Date(e.timestamp).getTime() < 24 * 3600 * 1000,
    );

    const byType = {};
    const byState = {};
    const bySeverity = { critical: 0, high: 0, moderate: 0, low: 0 };
    const byHour = {};

    for (const event of last24h) {
      // By type
      byType[event.disasterType] = (byType[event.disasterType] || 0) + 1;
      // By state
      if (event.state) {
        byState[event.state] = (byState[event.state] || 0) + 1;
      }
      // By severity
      if (bySeverity[event.severity] !== undefined) {
        bySeverity[event.severity]++;
      }
      // By hour
      const hour = new Date(event.timestamp).getHours();
      byHour[hour] = (byHour[hour] || 0) + 1;
    }

    // Most affected district
    const locationCounts = {};
    for (const event of last24h) {
      if (event.locationName) {
        locationCounts[event.locationName] =
          (locationCounts[event.locationName] || 0) + 1;
      }
    }
    const mostAffected = Object.entries(locationCounts).sort(
      (a, b) => b[1] - a[1],
    )[0];

    return {
      total: this.events.length,
      last24h: last24h.length,
      byType,
      byState,
      bySeverity,
      byHour,
      mostAffected: mostAffected
        ? { name: mostAffected[0], count: mostAffected[1] }
        : null,
      totalAffectedPeople: last24h.reduce(
        (sum, e) => sum + (e.affectedCount || 0),
        0,
      ),
    };
  }

  getTrendData(hours = 48) {
    const now = Date.now();
    const bucketSize = 3600 * 1000; // 1 hour
    const buckets = [];

    for (let i = hours; i >= 0; i--) {
      const bucketStart = now - i * bucketSize;
      const bucketEnd = bucketStart + bucketSize;
      const events = this.events.filter((e) => {
        const t = new Date(e.timestamp).getTime();
        return t >= bucketStart && t < bucketEnd;
      });

      const types = {};
      for (const e of events) {
        types[e.disasterType] = (types[e.disasterType] || 0) + 1;
      }

      buckets.push({
        time: new Date(bucketStart).toISOString(),
        hour: new Date(bucketStart).getHours(),
        total: events.length,
        flood: types.flood || 0,
        landslide: types.landslide || 0,
        heavy_rain: types.heavy_rain || 0,
        infrastructure: types.infrastructure || 0,
      });
    }

    return buckets;
  }

  getHeatmapData(startTime = null, endTime = null) {
    let filtered = this.events;
    if (startTime && endTime) {
      filtered = this.getByTimeRange(startTime, endTime);
    }
    return filtered
      .filter((e) => e.lat && e.lng)
      .map((e) => ({
        lat: e.lat,
        lng: e.lng,
        intensity: e.severityLevel / 4,
      }));
  }
}

export { EventStore };
