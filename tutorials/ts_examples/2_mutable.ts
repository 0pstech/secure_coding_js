// 1. 객체와 배열의 직접 수정으로 인한 문제 - 불변 객체 사용
import { Map, List, fromJS, Collection } from 'immutable';

// 옵션 타입 정의
interface UpdateOptions {
  type?: 'object' | 'array' | 'nested' | 'arrayObject';
}

// 중첩 업데이트 타입 정의
interface NestedUpdate {
  path: string;
  value: any;
}

// 배열 객체 업데이트 타입 정의
interface ArrayObjectUpdate {
  id: string | number;
  changes: Record<string, any>;
}

function updateData<T>(data: T, updates: any, options: UpdateOptions = {}): T {
  // 입력 데이터를 Immutable.js 객체로 변환
  const immutableData: Collection<any, any> = Array.isArray(data) ? List(data) : Map(data as Record<string, any>);
  
  // 객체 불변 수정 - Immutable.js Map 사용
  if (options.type === 'object') {
    return (immutableData as Map<string, any>).merge(updates).toJS() as T;
  }
  // 배열 불변 수정 - Immutable.js List 사용
  else if (options.type === 'array') {
    if (Array.isArray(data)) {
      return (immutableData as List<any>).push(updates).toJS() as T;
    }
    return data;
  }
  // 중첩 객체 불변 수정 - Immutable.js의 setIn 사용
  else if (options.type === 'nested') {
    const { path, value } = updates as NestedUpdate;
    const parts = path.split('.');
    
    // 깊은 중첩 구조를 위해 fromJS 사용
    const deepImmutable = fromJS(data) as Map<string, any>;
    return deepImmutable.setIn(parts, value).toJS() as T;
  }
  // 배열 내 객체 불변 수정 - Immutable.js의 update 사용
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
  
  // 기본적으로 원본 데이터의 불변 복사본 반환
  return immutableData.toJS() as T;
}

// 2. Prototype Pollution 방지: 불변 객체를 사용한 안전한 병합 함수
function secureMerge<T extends Record<string, any>, U extends Record<string, any>>(
  target: T, 
  source: U
): T & Omit<U, '__proto__' | 'constructor' | 'prototype'> {
  // 원본 객체를 Immutable.js Map으로 변환
  const immutableTarget = Map(target);
  const immutableSource = Map(source);
  
  // 안전한 속성만 필터링 (프로토타입 오염 방지)
  const safeSource = immutableSource.filter((_, key) => {
    return key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
  });
  
  // 불변 객체 병합 후 일반 객체로 변환하여 반환
  return immutableTarget.merge(safeSource).toJS() as T & Omit<U, '__proto__' | 'constructor' | 'prototype'>;
}

console.log('--------------------------------');
console.log('1. 객체와 배열의 불변 수정');
// 불변 객체를 사용한 객체 수정 예제
const obj = { a: 1, b: 2 };
const updates = { a: 3, c: 4 };
const updated_obj = updateData(obj, updates, { type: 'object' });
console.log('원본 객체:', obj); // { a: 1, b: 2 } - 변경되지 않음
console.log('새 객체:', updated_obj); // { a: 3, b: 2, c: 4 }
console.log('--------------------------------');

// 불변 객체를 사용한 배열 수정 예제
const arr = [1, 2, 3];
const updated_arr = updateData(arr, 4, { type: 'array' });
console.log('원본 배열:', arr); // [1, 2, 3] - 변경되지 않음
console.log('새 배열:', updated_arr); // [1, 2, 3, 4]
console.log('--------------------------------');
// 중첩 객체 수정 예제
const nestedObj = { user: { profile: { name: 'John', age: 30 } } };
const updated_nested = updateData(nestedObj, { path: 'user.profile.age', value: 31 }, { type: 'nested' });
console.log('원본 중첩 객체:', nestedObj); // 변경되지 않음
console.log('새 중첩 객체:', updated_nested); // age가 31로 변경됨

console.log('--------------------------------');
console.log('2. Prototype Pollution 방지');
const baseSettings = { theme: "light" };
const userSettings = Object.create(baseSettings);
// 공격자가 전달한 악의적 페이로드 (JSON 형태)
const maliciousPayload = JSON.parse('{"isAdmin": true, "__proto__": {"malicious": true}}');
// 불변 객체를 사용한 안전한 병합 함수 사용
const safeResult = secureMerge(baseSettings, maliciousPayload);
console.log("safeResult.isAdmin:", safeResult.isAdmin); // true - 정상 속성은 복사됨
console.log("userSettings.isAdmin:", userSettings.isAdmin); // undefined - 프로토타입 오염 방지