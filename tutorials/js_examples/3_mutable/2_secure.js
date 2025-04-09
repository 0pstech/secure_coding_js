// 1. Issues with direct modification of objects and arrays - Using immutable objects
import { Map, List, fromJS } from 'immutable';

function updateData(data, updates, options = {}) {
  // Convert input data to Immutable.js objects
  const immutableData = Array.isArray(data) ? List(data) : Map(data);
  
  // Immutable object modification - Using Immutable.js Map
  if (options.type === 'object') {
    return immutableData.merge(updates).toJS();
  }
  // Immutable array modification - Using Immutable.js List
  else if (options.type === 'array') {
    return immutableData.push(updates).toJS();
  }
  // Immutable nested object modification - Using Immutable.js setIn
  else if (options.type === 'nested') {
    const { path, value } = updates;
    const parts = path.split('.');
    
    // Using fromJS for deep nested structures
    const deepImmutable = fromJS(data);
    return deepImmutable.setIn(parts, value).toJS();
  }
  // Immutable object modification within array - Using Immutable.js update
  else if (options.type === 'arrayObject') {
    const { id, changes } = updates;
    
    const immutableList = List(data);
    const index = immutableList.findIndex(item => item.get('id') === id);
    
    if (index !== -1) {
      return immutableList.update(index, item => item.merge(changes)).toJS();
    }
    return data;
  }
  
  // By default, return an immutable copy of the original data
  return immutableData.toJS();
}

// 2. Preventing Prototype Pollution: Safe merge function using immutable objects
function secureMerge(target, source) {
  // Convert original objects to Immutable.js Map
  const immutableTarget = Map(target);
  const immutableSource = Map(source);
  
  // Filter only safe properties (prevent prototype pollution)
  const safeSource = immutableSource.filter((_, key) => {
    return key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
  });
  
  // Merge immutable objects and convert back to regular object
  return immutableTarget.merge(safeSource).toJS();
}

// console.log('--------------------------------');
// console.log('1. Immutable modification of objects and arrays');
// // Example of object modification using immutable objects
// const obj = { a: 1, b: 2 };
// const updates = { a: 3, c: 4 };
// const updated_obj = updateData(obj, updates, { type: 'object' });
// console.log('Original object:', obj); // { a: 1, b: 2 } - Not modified
// console.log('New object:', updated_obj); // { a: 3, b: 2, c: 4 }
// console.log('--------------------------------');

// // Example of array modification using immutable objects
// const arr = [1, 2, 3];
// const updated_arr = updateData(arr, 4, { type: 'array' });
// console.log('Original array:', arr); // [1, 2, 3] - Not modified
// console.log('New array:', updated_arr); // [1, 2, 3, 4]
// console.log('--------------------------------');

// // Nested object modification example
// const nestedObj = { user: { profile: { name: 'John', age: 30 } } };
// const updated_nested = updateData(nestedObj, { path: 'user.profile.age', value: 31 }, { type: 'nested' });
// console.log('Original nested object:', nestedObj); // Not modified
// console.log('New nested object:', updated_nested); // age changed to 31

console.log('--------------------------------');
console.log('2. Preventing Prototype Pollution');
const baseSettings = { theme: "light" };
const userSettings = Object.create(baseSettings);
// Malicious payload from attacker (in JSON format)
const maliciousPayload = JSON.parse('{"isAdmin": true, "__proto__": {"malicious": true}}');
// Using safe merge function with immutable objects
const safeResult = secureMerge(baseSettings, maliciousPayload);
console.log("safeResult.isAdmin:", safeResult.isAdmin); // true - Normal properties are copied
console.log("userSettings.isAdmin:", userSettings.isAdmin, userSettings); // undefined - Prototype pollution prevented