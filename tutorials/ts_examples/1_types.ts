// 1. 타입스크립트를 사용한 타입 안전성 확보
function tsImplicitTypeConversion(a: number, b: number): number {
    // 타입스크립트에서는 매개변수 타입이 이미 검증되므로 런타임 검사 불필요
    return a + b;
}
  
// 2. 타입스크립트를 사용한 문자열 비교 안전성
function tsAuthentication(storedToken: string, userToken: string): boolean {
    // 타입스크립트에서는 매개변수 타입이 이미 검증되므로 런타임 타입 검사 불필요
    
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

// 3. 타입스크립트를 사용한 배열 타입 안전성
function tsArrayOperation(data: number[]): number[] {
    // 타입스크립트에서는 배열 타입과 요소 타입이 이미 검증되므로 런타임 검사 불필요
    return data.filter(item => item > 10);
}

// 4. 타입스크립트를 사용한 객체 타입 안전성
interface UserPreferences {
    theme: string;
}

interface User {
    name: string;
    isAdmin: boolean;
    preferences: UserPreferences;
}

function tsUserDataProcessing(user: User): boolean {
    // 타입스크립트에서는 객체 구조와 타입이 이미 검증되므로 대부분의 런타임 검사 불필요
    
    // 안전하게 구조 분해 할당
    const { name: userName, preferences: { theme } } = user;

    if (user.isAdmin) {
        console.log(`관리자 ${userName}님이 로그인했습니다. 테마: ${theme}`);
        return true;
    } else {
        console.log(`일반 사용자 ${userName}님이 로그인했습니다. 테마: ${theme}`);
        return false;
    }
}

// 5. 타입스크립트를 사용한 문자열 타입 안전성
function tsCreateFilePath(directory: string, filename: string): string {
    // 타입스크립트에서는 매개변수 타입이 이미 검증되므로 런타임 타입 검사 불필요
    
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

// 6. 타입스크립트를 사용한 null, undefined 처리
interface DataWithValue {
    value: string | number; // null과 undefined는 허용하지 않음
}

function tsNullUndefinedHandling(data: DataWithValue): string | number {
    // 타입스크립트에서는 객체 구조와 타입이 이미 검증되므로 대부분의 런타임 검사 불필요
    return data.value;
}

// 테스트 케이스
// console.log('--------------------------------');
// console.log('1. 타입스크립트 타입 안전성');
// try {
//     console.log(tsImplicitTypeConversion(1, 2)); // 3 - 정상 케이스
//     // console.log(tsImplicitTypeConversion('1', 2));
// } catch (error) {
//     if (error instanceof Error) {
//         console.error('타입 오류 발생:', error.message);
//     } else {
//         console.error('알 수 없는 타입 오류 발생:', error);
//     }
// }
// console.log('--------------------------------');

// console.log('--------------------------------');
// console.log('2. 타입스크립트 문자열 비교 안전성');
// try {
//     console.log(tsAuthentication('token1', 'token1')); // true - 정상 케이스
//     // console.log(tsAuthentication(null, undefined));
// } catch (error: unknown) {
//     if (error instanceof Error) {
//         console.error('인증 오류 발생:', error.message);
//     } else {
//         console.error('알 수 없는 인증 오류 발생');
//     }
// }
// console.log('--------------------------------');

// console.log('--------------------------------');
// console.log('3. 타입스크립트 배열 타입 안전성');
// try {
//     console.log(tsArrayOperation([1, 10, 20])); // 정상 케이스
//     // console.log(tsArrayOperation(['1', 10, 20]));
// } catch (error: unknown) {
//     if (error instanceof Error) {
//         console.error('배열 처리 오류 발생:', error.message);
//     } else {
//         console.error('배열 처리 오류 발생:', '알 수 없는 오류');
//     }
// }
// console.log('--------------------------------');

// console.log('--------------------------------');
// console.log('4. 타입스크립트 객체 타입 안전성');
// try {
//     console.log(tsUserDataProcessing({
//         name: '홍길동',
//         isAdmin: true,
//         preferences: { theme: 'dark' }
//     })); // true - 정상 케이스
//     // console.log(tsUserDataProcessing({
//     //     name: '홍길동',
//     //     isAdmin: null,
//     //     preferences: { theme: 'dark' }
//     // }));
// } catch (error: unknown) {
//     if (error instanceof Error) {
//         console.error('객체 처리 오류 발생:', error.message);
//     } else {
//         console.error('객체 처리 오류 발생:', '알 수 없는 오류');
//     }
// }
// console.log('--------------------------------');

// console.log('--------------------------------');
// console.log('5. 타입스크립트 문자열 타입 안전성');
// try {
//     console.log(tsCreateFilePath('user', 'profile.jpg')); // 정상 케이스
//     // 타입스크립트에서는 컴파일 시 오류 발생: console.log(tsCreateFilePath('user', null));
//     console.log(tsCreateFilePath('user', '../profile.jpg')); // Error
// } catch (error: unknown) {
//     if (error instanceof Error) {
//         console.error('파일 경로 오류 발생:', error.message);
//     } else {
//         console.error('파일 경로 오류 발생:', '알 수 없는 오류');
//     }
// }
// console.log('--------------------------------');

console.log('--------------------------------');
console.log('6. 타입스크립트 null, undefined 처리');
try {
    console.log(tsNullUndefinedHandling({ value: 'test' })); // 정상 케이스
    // console.log(tsNullUndefinedHandling(null));
    // console.log(tsNullUndefinedHandling({}));
} catch (error) {
    if (error instanceof Error) {
        console.error('null/undefined 처리 오류 발생:', error.message);
    } else {
        console.error('null/undefined 처리 오류 발생:', '알 수 없는 오류');
    }
}
console.log('--------------------------------'); 