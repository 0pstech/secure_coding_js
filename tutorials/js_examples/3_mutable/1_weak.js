// 1. Issues with direct modification of objects and arrays
function updateData(data, updates, options = {}) {
  // Direct object modification
  // Problem: Direct modification of the original object can cause unintended side effects
  // Caller may not expect changes to the original data
  if (options.type === 'object') {
    for (const key in updates) {
      data[key] = updates[key];
    }
  }
  // Direct array modification
  // Problem: Direct modification of the original array can affect other code that references it
  // push method is a mutation method that changes the original array
  else if (options.type === 'array') {
    data.push(updates);
  }
  // Nested object modification
  // Problem: Direct modification of deeply nested objects can alter the original data structure
  // No error handling for invalid paths can lead to runtime errors
  else if (options.type === 'nested') {
    const { path, value } = updates;
    const parts = path.split('.');
    let current = data;
    
    for (let i = 0; i < parts.length - 1; i++) {
      // Potential error if intermediate path doesn't exist
      current = current[parts[i]];
    }
    
    current[parts[parts.length - 1]] = value;
  }
  // Object modification within array
  // Problem: Object.assign() only performs shallow copy, sharing references of nested objects
  // Direct modification of objects in the original array can affect other references
  else if (options.type === 'arrayObject') {
    const { id, changes } = updates;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        Object.assign(data[i], changes);
        break;
      }
    }
  }
  
  // Problem: Returning the original object can cause confusion if caller expects a new object
  // Violates the principle of immutability
  return data;
}

// 2. Prototype Pollution issue: Vulnerable merge function (merges without validation)
function insecureMerge(target, source) {
  for (const key in source) {
    target[key] = source[key];
  }
  return target;
}

// console.log('--------------------------------');
// console.log('1. Issues with direct modification of objects and arrays');
// // This code calls updateData function to directly modify an object
// // Problem: The original object (obj) is directly modified, violating the immutability principle,
// // which can lead to unexpected side effects
// // When a function modifies the original data, it affects code that references that data elsewhere
// const obj = { a: 1, b: 2 };
// const updates = { a: 3, c: 4 };
// const updated_obj = updateData(obj, updates, { type: 'object' });
// console.log('Original object:', obj); // Modified
// console.log('New object:', updated_obj); // { a: 3, b: 2, c: 4 }

// // Array modification example
// const arr = [1, 2, 3];
// const updated_arr = updateData(arr, 4, { type: 'array' });
// console.log('Original array:', arr); // [1, 2, 3] - Not modified
// console.log('New array:', updated_arr); // [1, 2, 3, 4]
// console.log('--------------------------------');

// // Nested object modification example
// const nestedObj = { user: { profile: { name: 'John', age: 30 } } };
// const updated_nested = updateData(nestedObj, { path: 'user.profile.age', value: 31 }, { type: 'nested' });
// console.log('Original nested object:', nestedObj); // Modified
// console.log('New nested object:', updated_nested); // age changed to 31

console.log('--------------------------------');
console.log('2. Prototype Pollution issue');
const baseSettings = { theme: "light" };
const userSettings = Object.create(baseSettings);
// Malicious payload from attacker (in JSON format)
const maliciousPayload = JSON.parse('{"isAdmin": true}');
// Assuming attacker attempts to maliciously merge with baseSettings (custom prototype)
const polluted = insecureMerge(baseSettings, maliciousPayload);
console.log("polluted.isAdmin:", polluted.isAdmin);
console.log("userSettings.isAdmin:", userSettings.isAdmin, userSettings); // true → baseSettings is polluted, affecting userSettings