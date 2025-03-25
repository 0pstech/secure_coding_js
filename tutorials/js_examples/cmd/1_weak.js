// 1. 암묵적 타입 변환으로 인한 문제

function implicitTypeConversion(a, b) {
  return a + b;
}

// 2. 암시적 타입 변환 오용으로 인한 문제

function vulnerableAuthentication(storedToken, userToken) {
  // 느슨한 동등 연산자(==)는 타입 변환을 수행하여 다음과 같은 취약점 발생 가능:
  // 1. 공격자가 숫자 토큰을 전송하면: storedToken='123', userToken=123 → true 반환
  // 2. 빈 배열과 빈 문자열 비교: storedToken=[], userToken='' → true 반환
  // 3. null과 undefined 비교: storedToken=null, userToken=undefined → true 반환
  if (storedToken == userToken) {
    return true; // 인증 성공
  }
  return false;
  
  // 보안 문제: 
  // 1. 다른 타입의 토큰이 동등하게 취급될 수 있음
  // 2. 타이밍 공격에 취약함 (토큰 길이에 따라 비교 시간이 달라짐)
}

// 3. 배열 타입 검증 부족으로 인한 문제
function vulnerableArrayOperation(data) {
  // 배열인지 확인하지 않고 바로 배열 메서드 사용
  return data.filter(item => item > 10);
}

// 4. 객체 속성 검증 부족으로 인한 문제
// 객체 타입 검증 없이 속성에 접근하면 런타임 오류 발생 가능
function vulnerableUserDataProcessing(user) {
  // 객체 타입 검증 없이 바로 속성에 접근
  const { name: userName, isAdmin, preferences: { theme } } = user;
  
  // 객체가 null이거나 undefined인 경우 런타임 오류 발생
  // preferences가 없는 경우에도 오류 발생
  // isAdmin이 undefined인 경우 false로 평가되어 보안 문제 발생 가능
  
  // 관리자 권한이 명시적으로 false가 아닌 경우(undefined, null, 0, '')에도
  // 일반 사용자로 처리되는 문제 발생
  if (isAdmin) {
    console.log(`관리자 ${userName}님이 로그인했습니다. 테마: ${theme}`);
    return true;
  } else {
    console.log(`일반 사용자 ${userName}님이 로그인했습니다. 테마: ${theme}`);
    return false;
  }
  
  // 추가 문제: userName이나 theme이 undefined인 경우 'undefined'로 출력됨
  // 예: user = { isAdmin: true } 입력 시 "관리자 undefined님이 로그인했습니다. 테마: undefined" 출력
}

// 5. 문자열 타입 검증 부족으로 인한 문제
function vulnerableCreateFilePath(directory, filename) {
  return directory + '/' + filename;
}

// 6. null, undefined 처리 부족으로 인한 문제

function vulnerableNullUndefinedHandling(data) {
  return data.value;
}


// 1. 암묵적 타입 변환으로 인한 문제
// console.log('--------------------------------');
// console.log('1. 암묵적 타입 변환으로 인한 문제');
// console.log(implicitTypeConversion('1', 2)); // "12"
// console.log(implicitTypeConversion(1, 2)); // 3
// console.log('--------------------------------');

// // 2. 암시적 타입 변환 오용으로 인한 문제
console.log('--------------------------------');
console.log('2. 암시적 타입 변환 오용으로 인한 문제');
console.log(vulnerableAuthentication('token1', 'token1')); // true
console.log(vulnerableAuthentication(null, undefined)); // 타입 검증 없음 - 오류 발생 가능
console.log('--------------------------------');

// // // 3. 배열 타입 검증 부족으로 인한 문제
// console.log('--------------------------------');
// console.log('4. 배열 타입 검증 부족으로 인한 문제');
// console.log(vulnerableArrayOperation([1, 10, 20]));
// console.log(vulnerableArrayOperation(1, 2));
// console.log('--------------------------------');


// // // 4. 객체 속성 검증 부족으로 인한 문제
// console.log('--------------------------------');
// console.log('3. 객체 속성 검증 부족으로 인한 문제');
// console.log(vulnerableUserDataProcessing({ name: '홍길동', isAdmin: true, preferences: { theme: 'dark' } })); // true
// console.log(vulnerableUserDataProcessing({ name: '홍길동', isAdmin: null, preferences: { theme: 'dark' } })); // false
// console.log('--------------------------------');


// // // 5. 문자열 타입 검증 부족으로 인한 문제
// console.log('--------------------------------');
// console.log('5. 문자열 타입 검증 부족으로 인한 문제');
// console.log(vulnerableCreateFilePath('user', 'profile.jpg')); // "user/profile.jpg"
// console.log(vulnerableCreateFilePath('user', null)); // "user/"
// console.log('--------------------------------');


// // // 6. null, undefined 처리 부족으로 인한 문제
// console.log('--------------------------------');
// console.log('6. null, undefined 처리 부족으로 인한 문제');
// console.log(vulnerableNullUndefinedHandling({ value: 'test' })); // "test"
// console.log(vulnerableNullUndefinedHandling(null)); // undefined
// console.log('--------------------------------');
