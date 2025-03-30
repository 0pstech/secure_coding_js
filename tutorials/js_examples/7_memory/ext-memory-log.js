// ext-memory-hog.js
const memoryHogLibrary = {
  cache: {},
  processData: function(id, data) {
    // 캐시에 데이터 저장 (제한 없이 계속 증가)
    this.cache[id] = {
      data: new Array(100_000).fill(data),
      timestamp: Date.now()
    };
    
    return `처리된 데이터 ID: ${id}`;
  },
  // 캐시 정리 메서드가 없거나 효과적이지 않음
  clearCache: function() {
    // 일부 캐시만 제거 (오래된 항목은 그대로 유지)
    const now = Date.now();
    Object.keys(this.cache).forEach(key => {
      // 최근 10초 내의 항목만 유지 (예시)
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