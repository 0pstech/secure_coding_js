// 1. Problems with direct object and array modification - Using immutable objects
import { Map, List, fromJS, Collection } from 'immutable';

// Option type definition
interface UpdateOptions {
  type?: 'object' | 'array' | 'nested' | 'arrayObject';
}

// Nested update type definition
interface NestedUpdate {
  path: string;
  value: any;
}

// Array object update type definition
interface ArrayObjectUpdate {
  id: string | number;
  changes: Record<string, any>;
}

function updateData<T>(data: T, updates: any, options: UpdateOptions = {}): T {
  // Convert input data to Immutable.js object
  const immutableData: Collection<any, any> = Array.isArray(data) ? List(data) : Map(data as Record<string, any>);
  
  // Immutable object modification - Using Immutable.js Map
  if (options.type === 'object') {
    return (immutableData as Map<string, any>).merge(updates).toJS() as T;
  }
  // Immutable array modification - Using Immutable.js List
  else if (options.type === 'array') {
    if (Array.isArray(data)) {
      return (immutableData as List<any>).push(updates).toJS() as T;
    }
    return data;
  }
  // Immutable nested object modification - Using Immutable.js setIn
  else if (options.type === 'nested') {
    const { path, value } = updates as NestedUpdate;
    const parts = path.split('.');
    
    // Using fromJS for deep nested structures
    const deepImmutable = fromJS(data) as Map<string, any>;
    return deepImmutable.setIn(parts, value).toJS() as T;
  }
  // Immutable array object modification - Using Immutable.js update
  else if (options.type === 'arrayObject') {
    const { id, changes } = updates as ArrayObjectUpdate;
    
    if (Array.isArray(data)) {
      const immutableList = List(data);
      const index = immutableList.findIndex(item => 
        typeof item === 'object' && item !== null && 'id' in item && item.id === id
      );
      
      if (index !== -1) {
        return immutableList.update(index, item => 
          (Map(item as Record<string, any>)).merge(changes)
        ).toJS() as T;
      }
    }
    return data;
  }
  
  // Return immutable copy of original data by default
  return immutableData.toJS() as T;
}

// 2. Prototype Pollution Prevention: Safe merge function using immutable objects
function secureMerge<T extends Record<string, any>, U extends Record<string, any>>(
  target: T, 
  source: U
): T & Omit<U, '__proto__' | 'constructor' | 'prototype'> {
  // Convert original objects to Immutable.js Map
  const immutableTarget = Map(target);
  const immutableSource = Map(source);
  
  // Filter only safe properties (prevent prototype pollution)
  const safeSource = immutableSource.filter((_, key) => {
    return key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
  });
  
  // Merge immutable objects and convert back to regular object
  return immutableTarget.merge(safeSource).toJS() as T & Omit<U, '__proto__' | 'constructor' | 'prototype'>;
}

console.log('--------------------------------');
console.log('1. Immutable Object and Array Modification');
// Example of object modification using immutable objects
const obj = { a: 1, b: 2 };
const updates = { a: 3, c: 4 };
const updated_obj = updateData(obj, updates, { type: 'object' });
console.log('Original object:', obj); // { a: 1, b: 2 } - Not modified
console.log('New object:', updated_obj); // { a: 3, b: 2, c: 4 }
console.log('--------------------------------');

// Example of array modification using immutable objects
const arr = [1, 2, 3];
const updated_arr = updateData(arr, 4, { type: 'array' });
console.log('Original array:', arr); // [1, 2, 3] - Not modified
console.log('New array:', updated_arr); // [1, 2, 3, 4]
console.log('--------------------------------');
// Example of nested object modification
const nestedObj = { user: { profile: { name: 'John', age: 30 } } };
const updated_nested = updateData(nestedObj, { path: 'user.profile.age', value: 31 }, { type: 'nested' });
console.log('Original nested object:', nestedObj); // Not modified
console.log('New nested object:', updated_nested); // age changed to 31

console.log('--------------------------------');
console.log('2. Prototype Pollution Prevention');
const baseSettings = { theme: "light" };
const userSettings = Object.create(baseSettings);
// Malicious payload from attacker (in JSON format)
const maliciousPayload = JSON.parse('{"isAdmin": true, "__proto__": {"malicious": true}}');
// Using safe merge function with immutable objects
const safeResult = secureMerge(baseSettings, maliciousPayload);
console.log("safeResult.isAdmin:", safeResult.isAdmin); // true - Normal property copied
console.log("userSettings.isAdmin:", userSettings.isAdmin); // undefined - Prototype pollution prevented 