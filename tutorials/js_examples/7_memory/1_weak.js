import memoryHogLibrary from './ext-memory-log.js';

// How to run: node --expose-gc 1_weak.js

// 1. Memory Leak - Reference Retention through Closure
// A closure is a combination of a function and the lexical environment in which it was declared.
// In the example below, the inner function references the outer function's variable (largeData),
// so the variable remains in memory even after the function is called, until the program terminates.
function createLargeDataProcessor() {
  // Create large data array (approximately 80MB)
  const largeData = new Array(10_000_000).fill('Data that consumes a lot of memory');
  
  return function process() {
    // Only uses a portion of the data but the entire array remains in memory
    console.log(`Data processing: First item length out of ${largeData.length} items: ${largeData[0].length}`);
  };
}

// 2. Memory Leak due to Circular References
function createCircularReference() {
  let obj1 = {};
  let obj2 = {};
  
  // Create circular reference
  obj1.ref = obj2;
  obj2.ref = obj1;
  
  return function() {
    // As long as this function is referenced, obj1 and obj2 won't be freed from memory
    console.log("Accessing circular reference objects:", Object.keys(obj1), Object.keys(obj2));
  };
}

// 3. Memory Leak Simulation due to Unremoved Event Listeners
const eventEmitter = {
  listeners: [],
  addEventListener(callback) {
    this.listeners.push(callback);
  },
  removeEventListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  },
  emit() {
    this.listeners.forEach(listener => listener());
  }
};

function setupEventHandlers() {
  // Object with large data
  const data = new Array(1_000_000).fill('Event data');
  
  // Register event listener
  const handler = () => {
    console.log(`Event triggered: Data size ${data.length}`);
  };
  
  eventEmitter.addEventListener(handler);
  
  // Event listener not removed
  // Correct way: eventEmitter.removeEventListener(handler);
}

// 4. Memory Management Issues with External Libraries
function useExternalLibrary() {
  // Process large amounts of data repeatedly
  for (let i = 0; i < 1000; i++) {
    memoryHogLibrary.processData(`item-${i}`, `Large data ${i}`);
  }
  
  // Calling the library's cache clearing method doesn't solve the memory issue
  // Reason: clearCache method only removes items older than 10 seconds,
  // and recently created items remain, causing continued memory leaks
  // Also storing large amounts of data (100,000 item array) for each item
  memoryHogLibrary.clearCache();
}

// 5. Memory Issues due to Not Using WeakMap/WeakSet
function createDomNodeRegistry() {
  // Using Map prevents referenced DOM nodes from being freed from memory
  // Should use WeakMap to automatically free memory when DOM nodes are deleted
  const registry = new Map();
  
  return {
    register: function(element, metadata) {
      registry.set(element, metadata);
    },
    getMetadata: function(element) {
      return registry.get(element);
    },
    getSize: function() {
      return registry.size;
    }
  };
}

// 6. Memory Reference Error Test Function
function testNullReferenceError() {
  try {
    let obj = null;
    // Attempt to access property of null object - reference error occurs
    console.log(obj.property);
  } catch (error) {
    console.error(`Reference error occurred: ${error.message}`);
  }
}

function testUndefinedReferenceError() {
  try {
    let arr = [1, 2, 3];
    // Access index beyond array bounds - returns undefined
    let item = arr[10];
    // Attempt to call method on undefined - reference error occurs
    console.log(item.toString());
  } catch (error) {
    console.error(`Reference error occurred: ${error.message}`);
  }
}

// 7. Integer Overflow Test Function
function testIntegerOverflow() {
  // Safe integer range in JavaScript: -(2^53 - 1) ~ (2^53 - 1)
  const maxSafeInteger = Number.MAX_SAFE_INTEGER; // 9007199254740991
  console.log(`Maximum safe integer: ${maxSafeInteger}`);
  
  // Overflow occurs
  const overflowed = maxSafeInteger + 10;
  console.log(`Overflow result: ${overflowed}`);
  console.log(`Precision loss check: ${overflowed === overflowed + 1}`);
  
  // Note: Unlike C, integer overflow in JavaScript doesn't lead to memory corruption or exploits
  // JavaScript automatically converts to floating-point or loses precision on integer overflow,
  // but doesn't cause security vulnerabilities like buffer overruns or memory corruption
  console.log("Unlike C, integer overflow in JavaScript doesn't lead to memory corruption or security vulnerabilities.");
  console.log("Instead, it only causes precision loss or unexpected calculation results.");
}

// 8. Array Buffer Overflow Test Function
function testArrayBufferOverflow() {
  try {
    // Create fixed-size buffer
    const buffer = new ArrayBuffer(4); // 4-byte buffer
    const view = new Uint8Array(buffer);
    
    // Access within buffer bounds
    view[0] = 10;
    view[3] = 40;
    console.log(`Values within buffer: ${view[0]}, ${view[3]}`);
    
    // Attempt to access beyond buffer bounds
    view[4] = 50; // Out of bounds
    console.log(`Out of bounds access result: ${view[4]}`);
    
    // Note: Unlike C, TypedArray in JavaScript doesn't cause memory corruption on out-of-bounds access
    // Instead, values are ignored or undefined is returned
    console.log("TypedArray in JavaScript doesn't cause memory corruption or exploits on out-of-bounds access.");
    console.log("JavaScript engine performs bounds checking to ensure memory safety.");
  } catch (error) {
    console.error(`Buffer overflow error: ${error.message}`);
  }
}

// Memory Usage Measurement Function
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

// Add time intervals between tests to allow for garbage collection
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
  // 1. Memory leak test due to closure
  console.log("--------------------------------");
  console.log("1. Memory leak due to closure");
  const processor = createLargeDataProcessor();
  processor(); // largeData remains in memory even after function call
  console.log("Debug: largeData array remains in memory (approximately 80MB)");
  await delay(1000);
  console.log("Memory usage after 1 second:", getMemoryUsage());

  // 2. Circular reference test
  console.log("--------------------------------");
  console.log("2. Memory leak due to circular references");
  const circularRef = createCircularReference();
  circularRef();
  console.log("Debug: Circular referenced objects not freed from memory");
  await delay(1000);
  console.log("Memory usage after 1 second:", getMemoryUsage());

  // 3. Unremoved event listener test
  console.log("--------------------------------");
  console.log("3. Unremoved event listeners");
  for (let i = 0; i < 10; i++) {
    setupEventHandlers();
  }
  console.log(`Debug: Number of unremoved event listeners: ${eventEmitter.listeners.length}`);
  await delay(1000);
  console.log("Memory usage after 1 second:", getMemoryUsage());

  // 4. External library memory management test
  console.log("--------------------------------");
  console.log("4. External library memory management issues");
  useExternalLibrary();
  console.log(`Debug: Number of library cache items: ${Object.keys(memoryHogLibrary.cache).length}`);
  await delay(1000);
  console.log("Memory usage after 1 second:", getMemoryUsage());

  // 5. Memory leak test due to not using WeakMap
  console.log("--------------------------------");
  console.log("5. Memory leak due to not using WeakMap");
  const domNodes = [];
  const registry = createDomNodeRegistry();

  // Create and register many DOM nodes
  for (let i = 0; i < 1000; i++) {
    const node = { id: `node-${i}`, content: `Node content ${i}` };
    domNodes.push(node);
    registry.register(node, { lastAccessed: Date.now() });
  }

  // Simulate DOM node deletion
  domNodes.length = 0; // Clear array
  // But references still remain in registry
  console.log(`Debug: Registry size (memory leak): ${registry.getSize()}`);
  await delay(1000);
  console.log("Memory usage after 1 second:", getMemoryUsage());

}

// Run tests
runTests().then(() => {
  console.log("\n--------------------------------");
  console.log("Final memory usage after all tests:");
  console.log(getMemoryUsage());
  console.log("--------------------------------");
});

  // // 6. Reference error tests
  // console.log("--------------------------------");
  // console.log("6. Reference error tests");
  // testNullReferenceError();
  // testUndefinedReferenceError();

  // // 7. Integer overflow test
  // console.log("--------------------------------");
  // console.log("7. Integer overflow test");
  // testIntegerOverflow();

  // // 8. Array buffer overflow test
  // console.log("--------------------------------");
  // console.log("8. Array buffer overflow test");
  // testArrayBufferOverflow();
