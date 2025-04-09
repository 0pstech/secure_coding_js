// ext-memory-hog.js
const memoryHogLibrary = {
  cache: {},
  processData: function(id, data) {
    // Store data in cache (continuously grows without limit)
    this.cache[id] = {
      data: new Array(100_000).fill(data),
      timestamp: Date.now()
    };
    
    return `Processed data ID: ${id}`;
  },
  // Cache clearing method is either missing or ineffective
  clearCache: function() {
    // Remove only some cache (old items remain)
    const now = Date.now();
    Object.keys(this.cache).forEach(key => {
      // Keep only items from the last 10 seconds (example)
      if (now - this.cache[key].timestamp > 10000) {
        delete this.cache[key];
      }
    });
  },
  clearAllCache: function() {
    this.cache = {};
  }
};

export default memoryHogLibrary;