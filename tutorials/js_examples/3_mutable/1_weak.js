// 1. 객체와 배열의 직접 수정으로 인한 문제
function updateData(data, updates, options = {}) {
  // 객체 직접 수정
  // 문제점: 원본 객체를 직접 변경하여 의도치 않은 사이드 이펙트 발생 가능
  // 호출자가 원본 데이터의 변경을 예상하지 못할 수 있음
  if (options.type === 'object') {
    for (const key in updates) {
      data[key] = updates[key];
    }
  }
  // 배열 직접 수정
  // 문제점: 원본 배열을 직접 변경하여 참조하는 다른 코드에 영향을 줄 수 있음
  // push 메서드는 원본 배열을 변경하는 변이(mutation) 메서드임
  else if (options.type === 'array') {
    data.push(updates);
  }
  // 중첩 객체 수정
  // 문제점: 깊은 중첩 객체의 직접 변경으로 원본 데이터 구조 변형
  // 경로가 유효하지 않을 경우 오류 처리가 없어 런타임 에러 발생 가능
  else if (options.type === 'nested') {
    const { path, value } = updates;
    const parts = path.split('.');
    let current = data;
    
    for (let i = 0; i < parts.length - 1; i++) {
      // 중간 경로가 없는 경우 오류 발생 가능성 있음
      current = current[parts[i]];
    }
    
    current[parts[parts.length - 1]] = value;
  }
  // 배열 내 객체 수정
  // 문제점: Object.assign()은 얕은 복사만 수행하여 중첩 객체의 참조가 공유됨
  // 원본 배열 내 객체를 직접 수정하여 다른 참조에 영향을 줄 수 있음
  else if (options.type === 'arrayObject') {
    const { id, changes } = updates;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        Object.assign(data[i], changes);
        break;
      }
    }
  }
  
  // 문제점: 원본 객체를 반환하므로 호출자가 새 객체를 기대한다면 혼란 발생 가능
  // 불변성(immutability) 원칙에 위배됨
  return data;
}

// 2. Prototype Pollution 문제: 취약한 병합 함수 (검증 없이 단순 병합)
function insecureMerge(target, source) {
  for (const key in source) {
    target[key] = source[key];
  }
  return target;
}

// console.log('--------------------------------');
// console.log('1. 객체와 배열의 직접 수정으로 인한 문제');
// // 이 코드는 updateData 함수를 호출하여 객체를 직접 수정합니다.
// // 문제점: 원본 객체(obj)가 직접 수정되어 불변성 원칙을 위반하고,
// // 이로 인해 예상치 못한 부작용이 발생할 수 있습니다.
// // 함수가 원본 데이터를 변경하면 다른 곳에서 해당 데이터를 참조하는 코드에 영향을 줍니다.
// const obj = { a: 1, b: 2 };
// const updates = { a: 3, c: 4 };
// const updated_obj = updateData(obj, updates, { type: 'object' });
// console.log(updated_obj); // { a: 3, b: 2, c: 4 }
// console.log(updates); // { a: 3, c: 4 }

console.log('--------------------------------');
console.log('2. Prototype Pollution 문제');
const baseSettings = { theme: "light" };
const userSettings = Object.create(baseSettings);
// 공격자가 전달한 악의적 페이로드 (JSON 형태)
const maliciousPayload = JSON.parse('{"isAdmin": true}');
// 공격자가 악의적으로 baseSettings(사용자 정의 프로토타입)에 병합을 시도했다고 가정
const polluted = insecureMerge(baseSettings, maliciousPayload);
console.log("polluted.isAdmin:", polluted.isAdmin);
console.log("userSettings.isAdmin:", userSettings.isAdmin); // true → baseSettings가 오염되어 userSettings에도 영향을 줌