// 1. this binding
const wkObject = {
  value: 100,
  delayedLog: function() {
    // Regular function callback: this refers to the global object (window, global) instead of myObject
    setTimeout(function() {
      // console.log(this);
      console.log(this.value); // undefined (or the value from the global object if it exists)
    }, 100);
  }
};

// 2. Async closure + Concurrency issues
// While closures are safe in single-threaded environments, they can become
// subject to concurrency issues when combined with async functions or parallel processing
// Solution: Serialization (Promise-Queue or Lock-like)
function createCounter() {
  let count = 0;
  return {
    increment: function() {
      setTimeout(() => {
        count++;
      }, Math.random() * 200); // Increment after random time
    },
    getCount: function() {
      return count;
    }
  };
}

// Execution
// console.log('--------------------------------');
// console.log('1. this binding');
// wkObject.delayedLog();

console.log('--------------------------------');
console.log('2. Closure variable update (Concurrency issue)');
const counter = createCounter();

for (let i = 0; i < 10; i++) {
  counter.increment(); // Call 10 times
}

setTimeout(() => {
  console.log(counter.getCount()); // ❌ Result may not always be 10!
}, 100);