import memoryHogLibrary from './ext-memory-log.js';

// How to run: node --expose-gc 2_secure.js

// 1. Memory Leak Prevention - Closure Usage Guidelines
// A closure is a combination of a function and the lexical environment in which it was declared.
// The example below improves memory efficiency by only referencing necessary data.
function createLargeDataProcessor() {
  // Create large data array (approximately 80MB)
  const largeData = new Array(10_000_000).fill('Data that consumes a lot of memory');
  
  // Extract and return only necessary information
  const dataLength = largeData.length;
  const firstItemLength = largeData[0].length;
  
  // Release reference to original data
  largeData.length = 0;
  
  return function process() {
    // Improve memory efficiency by using only necessary information
    console.log(`Data processing: First item length out of ${dataLength} items: ${firstItemLength}`);
  };
}

// 2. Circular Reference Prevention
function createSafeReference() {
  let obj1 = {};
  let obj2 = {};
  
  // Use weak references or change to unidirectional references
  obj1.id = "obj1";
  obj2.parentId = "obj1";
  
  // Clean up references when function ends
  const result = function() {
    console.log("Safe object reference:", obj1.id, obj2.parentId);
  };
  
  // Add method for reference cleanup when function ends
  result.cleanup = function() {
    obj1 = null;
    obj2 = null;
  };
  
  return result;
}

// 3. Safe Event Listener Management
const eventEmitter = {
  listeners: [],
  addEventListener(callback) {
    this.listeners.push(callback);
    // Return listener removal function
    return () => this.removeEventListener(callback);
  },
  removeEventListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  },
  emit() {
    this.listeners.forEach(listener => listener());
  },
  // Add method to remove all listeners
  removeAllListeners() {
    this.listeners = [];
  }
};

function setupEventHandlers() {
  // Capture only necessary data
  const dataSize = 1_000_000;
  
  // Register event listener and store removal function
  const handler = () => {
    console.log(`Event triggered: Data size ${dataSize}`);
  };
  
  const removeListener = eventEmitter.addEventListener(handler);
  
  // Return listener removal function after use
  return removeListener;
}

// 4. Safe External Library Usage
function useExternalLibrarySafely() {
  // Limit memory usage with batch processing
  const batchSize = 100;
  
  for (let i = 0; i < 1000; i += batchSize) {
    // Process in batches - improve memory safety
    // Process data in small batches instead of all at once
    const endIndex = Math.min(i + batchSize, 1000);
    
    // Why this approach is safe:
    // 1. Limits amount of data loaded into memory at once
    // 2. Allows cache clearing and GC after each batch, preventing memory leaks
    // 3. Reduces memory usage peaks by splitting large tasks into smaller units
    for (let j = i; j < endIndex; j++) {
      memoryHogLibrary.processData(`item-${j}`, `Large data ${j}`);
    }
    
    // Clear cache after each batch
    memoryHogLibrary.clearCache();
    
    // Provide garbage collection hint if needed
    if (global.gc) {
      global.gc();
    }
  }
  
  // Clear entire cache after work completion
  // 1. Ideal case: Use clearAllCache method if available in library
  // memoryHogLibrary.clearAllCache();
  
  // 2. Alternative when library modification is not possible:
  // Manually clear cache by directly accessing cache object
  if (memoryHogLibrary.cache) {
    // Method 1: Clear cache object
    Object.keys(memoryHogLibrary.cache).forEach(key => {
      delete memoryHogLibrary.cache[key];
    });
    
    // Method 2: Replace with new empty object (more efficient)
    // memoryHogLibrary.cache = {};
    
    console.log('Manually cleared external library cache.');
  }
  
  // Provide garbage collection hint
  if (global.gc) {
    global.gc();
  }
}

// 5. Memory Management Improvement with WeakMap/WeakSet
function createDomNodeRegistry() {
  // Using WeakMap allows automatic memory release when DOM nodes are deleted
  const registry = new WeakMap();
  
  return {
    register: function(element, metadata) {
      if (!element || typeof element !== 'object') {
        throw new TypeError('Element must be an object');
      }
      registry.set(element, metadata);
    },
    getMetadata: function(element) {
      return registry.get(element);
    },
    // WeakMap doesn't have size property, so provide alternative
    hasElement: function(element) {
      return registry.has(element);
    }
  };
}

// 6. Safe Memory Reference Handling
function testSafeNullReference() {
  try {
    let obj = null;
    // Safely access after null check
    console.log(obj && obj.property || 'Property does not exist');
    
    // Use optional chaining
    console.log(obj?.property || 'Property does not exist');
  } catch (error) {
    console.error(`Reference error occurred: ${error.message}`);
  }
}

function testSafeUndefinedReference() {
  try {
    let arr = [1, 2, 3];
    // Safely access after array bounds check
    const index = 10;
    const item = index < arr.length ? arr[index] : undefined;
    
    // Safe method call
    console.log(item !== undefined ? item.toString() : 'Invalid item');
  } catch (error) {
    console.error(`Reference error occurred: ${error.message}`);
  }
}

// 7. Safe Integer Handling
function testSafeIntegerHandling() {
  // Safe integer range in JavaScript: -(2^53 - 1) ~ (2^53 - 1)
  const maxSafeInteger = Number.MAX_SAFE_INTEGER; // 9007199254740991
  console.log(`Maximum safe integer: ${maxSafeInteger}`);
  
  // Check safe integer range
  const value = maxSafeInteger + 10;
  if (!Number.isSafeInteger(value)) {
    console.log(`Warning: ${value} is outside safe integer range`);
    
    // Use BigInt to maintain precision
    const safeBigInt = BigInt(maxSafeInteger) + 10n;
    console.log(`BigInt result: ${safeBigInt.toString()}`);
  }
  
  console.log("In JavaScript, use Number.isSafeInteger() to check safe integer range,");
  console.log("and use BigInt for calculations with large integers where precision is important.");
}

// 8. Safe Array Buffer Access
function testSafeArrayBufferAccess() {
  try {
    // Create fixed-size buffer
    const buffer = new ArrayBuffer(4); // 4-byte buffer
    const view = new Uint8Array(buffer);
    
    // Access within buffer bounds
    view[0] = 10;
    view[3] = 40;
    console.log(`Values within buffer: ${view[0]}, ${view[3]}`);
    
    // Safely access after bounds check
    const index = 4;
    if (index < view.length) {
      view[index] = 50;
    } else {
      console.log(`Safe access: Index ${index} is outside buffer bounds (${view.length})`);
    }
    
    console.log("JavaScript's TypedArray has built-in bounds checking to ensure memory safety.");
    console.log("Additional bounds checking can make code even safer.");
  } catch (error) {
    console.error(`Buffer access error: ${error.message}`);
  }
}

// Memory Usage Measurement and Monitoring Function
function getMemoryUsage() {
  if (global.gc) {
    global.gc(); // Force garbage collection
  }
  
  const memoryUsage = process.memoryUsage();
  return {
    rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`
  };
}

// Measure memory usage before starting tests
console.log("\n--------------------------------");
console.log("Memory usage before starting tests:");
console.log(getMemoryUsage());

// 각 테스트 사이에 시간 간격을 두어 가비지 컬렉션 기회 제공
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
  // 1. 클로저 메모리 관리 테스트
  console.log("--------------------------------");
  console.log("1. Safe Closure Memory Management");
  const processor = createLargeDataProcessor();
  processor();
  console.log("Memory improvement: Referencing only necessary data to reduce memory usage");
  await delay(1000); // 1초 대기
  console.log("1초 후 메모리 사용량:", getMemoryUsage());

  // 2. 안전한 참조 테스트
  console.log("--------------------------------");
  console.log("2. Circular Reference Prevention");
  const safeRef = createSafeReference();
  safeRef();
  safeRef.cleanup();
  console.log("Memory improvement: Explicit reference cleanup to prevent memory leaks");
  await delay(1000);
  console.log("1초 후 메모리 사용량:", getMemoryUsage());

  // 3. 이벤트 리스너 안전한 관리 테스트
  console.log("--------------------------------");
  console.log("3. Safe Event Listener Management");
  const removeListeners = [];
  for (let i = 0; i < 10; i++) {
    removeListeners.push(setupEventHandlers());
  }
  console.log(`등록된 이벤트 리스너 수: ${eventEmitter.listeners.length}`);
  removeListeners.forEach(remove => remove());
  console.log(`정리 후 이벤트 리스너 수: ${eventEmitter.listeners.length}`);
  await delay(1000);
  console.log("1초 후 메모리 사용량:", getMemoryUsage());

  // 4. 외부 라이브러리 안전한 사용 테스트
  console.log("--------------------------------");
  console.log("4. Safe External Library Usage");
  useExternalLibrarySafely();
  console.log("Memory improvement: Limiting memory usage with batch processing and periodic cache clearing");
  await delay(1000);
  console.log("1초 후 메모리 사용량:", getMemoryUsage());

  // 5. WeakMap 사용 테스트
  console.log("--------------------------------");
  console.log("5. Memory Management Improvement with WeakMap/WeakSet");
  const domNodes = [];
  const registry = createDomNodeRegistry();

  for (let i = 0; i < 1000; i++) {
    const node = { id: `node-${i}`, content: `노드 콘텐츠 ${i}` };
    domNodes.push(node);
    registry.register(node, { lastAccessed: Date.now() });
  }

  const remainingNode = domNodes[0];
  
  domNodes.length = 0;
  console.log(`남은 노드 메타데이터 존재 여부: ${registry.hasElement(remainingNode)}`);
  console.log("Memory improvement: Automatic memory release when DOM nodes are deleted using WeakMap");
  await delay(1000);
  console.log("1초 후 메모리 사용량:", getMemoryUsage());
}

// 테스트 실행
runTests().then(() => {
  console.log("\n--------------------------------");
  console.log("모든 테스트 완료 후 최종 메모리 사용량:");
  console.log(getMemoryUsage());
  console.log("--------------------------------");
  console.log("Safe memory management ensures memory usage remains efficient.");
});

// // 6. Reference error tests
// console.log("--------------------------------");
// console.log("6. Safe Memory Reference Handling");
// testSafeNullReference();
// testSafeUndefinedReference();

// // 7. Integer overflow test
// console.log("--------------------------------");
// console.log("7. Safe Integer Handling");
// testSafeIntegerHandling();

// // 8. Array buffer overflow test
// console.log("--------------------------------");
// console.log("8. Safe Array Buffer Access");
// testSafeArrayBufferAccess();
