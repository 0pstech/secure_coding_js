// 1. this binding
const scObject = {
  value: 100,
  delayedLog: function() {
    // Arrow function callback: this refers to the myObject (references parent scope)
    setTimeout(() => {
    //   console.log(this);
      console.log(this.value); // 100
    }, 100);
  }
};

// 2. Safe async closure handling
function createSafeCounter() {
  let count = 0;
  let queue = Promise.resolve();

  return {
    increment: function() {
      queue = queue.then(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            count++;
            resolve();
          }, Math.random() * 200);
        });
      });
    },
    getCount: function() {
      return queue.then(() => count);
    }
  };
}

// Execution
console.log('--------------------------------');
console.log('1. this binding');
scObject.delayedLog();

console.log('--------------------------------');
console.log('2. Closure variable update');
const counter = createSafeCounter();

for (let i = 0; i < 10; i++) {
  counter.increment(); // Call 10 times
}

setTimeout(() => {
  counter.getCount().then(count => {
    console.log('Final count:', count); // ✅ Now it can be 10
  });
}, 200); // Long enough compared to 100ms (considering random delay)