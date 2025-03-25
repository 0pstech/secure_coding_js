// 1. 암묵적 타입 변환으로 인한 문제
function secureImplicitTypeConversion(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new TypeError('두 매개변수 모두 숫자여야 합니다');
    }
    return a + b;
}
  
// 2. 암시적 타입 변환 오용으로 인한 문제
function secureAuthentication(storedToken, userToken) {
    // 타입과 값 모두 비교하는 엄격한 동등 연산자(===) 사용
    if (typeof storedToken !== 'string' || typeof userToken !== 'string') {
        throw new TypeError('토큰은 문자열이어야 합니다');
    }
    
    // 문자열 길이가 다르면 즉시 인증 실패 처리
    if (storedToken.length !== userToken.length) {
        return false;
    }
    
    // 엄격한 동등 연산자로 비교
    if (storedToken === userToken) {
        return true; // 인증 성공
    }
    return false;
}

// 3. 배열 타입 검증 부족으로 인한 문제
function secureArrayOperation(data) {
    // 배열 타입 검증 추가
    if (!Array.isArray(data)) {
        throw new TypeError('데이터는 배열이어야 합니다');
    }
    
    // 배열 요소 타입 검증
    if (!data.every(item => typeof item === 'number')) {
        throw new TypeError('모든 배열 요소는 숫자여야 합니다');
    }
    
    return data.filter(item => item > 10);
}

// 4. 객체 속성 검증 부족으로 인한 문제
function secureUserDataProcessing(user) {
    // 객체 타입 검증 추가
    if (!user || typeof user !== 'object') {
        throw new TypeError('사용자 데이터는 객체여야 합니다');
    }
    
    // 필수 속성 존재 여부 확인
    if (!('name' in user)) {
        throw new TypeError('사용자 이름은 필수입니다');
    }
    
    // isAdmin 속성이 명시적 boolean 타입인지 확인
    if (typeof user.isAdmin !== 'boolean') {
        throw new TypeError('isAdmin은 boolean 타입이어야 합니다');
    }
    
    // preferences 객체 확인 및 기본값 설정
    if (!user.preferences || typeof user.preferences !== 'object') {
        throw new TypeError('preferences 객체는 필수입니다');
    }
    
    if (!('theme' in user.preferences)) {
        throw new TypeError('theme 속성은 필수입니다');
    }
    
    // 안전하게 구조 분해 할당
    const userName = user.name;
    const theme = user.preferences.theme;

    if (user.isAdmin === true) {
        console.log(`관리자 ${userName}님이 로그인했습니다. 테마: ${theme}`);
        return true;
    } else {
        console.log(`일반 사용자 ${userName}님이 로그인했습니다. 테마: ${theme}`);
        return false;
    }
}

// 5. 문자열 타입 검증 부족으로 인한 문제
function secureCreateFilePath(directory, filename) {
    // 디렉토리와 파일명이 모두 문자열인지 확인
    if (typeof directory !== 'string' || typeof filename !== 'string') {
        throw new TypeError('디렉토리와 파일명은 문자열이어야 합니다');
    }
    
    // 빈 문자열 처리
    if (!directory || !filename) {
        throw new Error('디렉토리와 파일명은 비어있을 수 없습니다');
    }
    
    // 경로 조작 방지
    if (directory.includes('..') || filename.includes('..')) {
        throw new Error('경로 조작은 허용되지 않습니다');
    }
    
    // 템플릿 리터럴 사용으로 안전한 문자열 연결
    return `${directory}/${filename}`;
}

// 6. null, undefined 처리 부족으로 인한 문제
function secureNullUndefinedHandling(data) {
    // 데이터가 객체인지 확인
    if (!data || typeof data !== 'object') {
        throw new TypeError('데이터는 객체여야 합니다');
    }

    // value 속성이 존재하는지 확인
    if (!('value' in data)) {
        throw new Error('데이터 객체는 value 속성을 가져야 합니다');
    }
    
    // value 속성의 타입 검증
    if (data.value === null || data.value === undefined) {
        throw new Error('value 속성은 null이나 undefined일 수 없습니다');
    }
    
    return data.value;
}

// 테스트 케이스
// console.log('--------------------------------');
// console.log('1. 암묵적 타입 변환으로 인한 문제');
// try {
//     console.log(secureImplicitTypeConversion(1, 2)); // 3 - 정상 케이스
//     console.log(secureImplicitTypeConversion('1', 2)); // TypeError
// } catch (error) {
//     console.error('타입 오류 발생:', error.message);
// }
// console.log('--------------------------------');

// console.log('--------------------------------');
// console.log('2. 암시적 타입 변환 오용으로 인한 문제');
// try {
//     console.log(secureAuthentication('token1', 'token1')); // true - 정상 케이스
//     console.log(secureAuthentication(null, undefined)); // 타입 검증 없음 - 오류 발생 가능
// } catch (error) {
//     console.error('인증 오류 발생:', error.message);
// }
// console.log('--------------------------------');

// console.log('--------------------------------');
// console.log('3. 배열 타입 검증 부족으로 인한 문제');
// try {
//     console.log(secureArrayOperation([1, 10, 20])); // 정상 케이스
//     // console.log(secureArrayOperation(1, 2)); // TypeError
//     console.log(secureArrayOperation(['1', 10, 20])); // TypeError
// } catch (error) {
//     console.error('배열 처리 오류 발생:', error.message);
// }
// console.log('--------------------------------');

// console.log('--------------------------------');
// console.log('4. 객체 속성 검증 부족으로 인한 문제');
// try {
//     console.log(secureUserDataProcessing({
//         name: '홍길동',
//         isAdmin: true,
//         preferences: { theme: 'dark' }
//     })); // true - 정상 케이스
//     console.log(secureUserDataProcessing({
//         name: '홍길동',
//         isAdmin: null,
//         preferences: { theme: 'dark' }
//     })); // TypeError
// } catch (error) {
//     console.error('객체 처리 오류 발생:', error.message);
// }
// console.log('--------------------------------');

// console.log('--------------------------------');
// console.log('5. 문자열 타입 검증 부족으로 인한 문제');
// try {
//     console.log(secureCreateFilePath('user', 'profile.jpg')); // 정상 케이스
//     // console.log(secureCreateFilePath('user', null)); // TypeError
//     console.log(secureCreateFilePath('user', '../profile.jpg')); // Error
// } catch (error) {
//     console.error('파일 경로 오류 발생:', error.message);
// }
// console.log('--------------------------------');

// console.log('--------------------------------');
// console.log('6. null, undefined 처리 부족으로 인한 문제');
// try {
//     console.log(secureNullUndefinedHandling({ value: 'test' })); // 정상 케이스
//     // console.log(secureNullUndefinedHandling(null)); // TypeError
//     console.log(secureNullUndefinedHandling({})); // Error
// } catch (error) {
//     console.error('null/undefined 처리 오류 발생:', error.message);
// }
// console.log('--------------------------------'); 