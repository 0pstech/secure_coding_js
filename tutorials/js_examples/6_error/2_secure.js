// 안전한 에러 처리 및 예외 처리 예시

// 1. 민감한 정보가 포함되지 않은 에러 메시지
function connectToDatabase(username, password) {
  try {
    // 데이터베이스 연결 시도 (실제로는 실패한다고 가정)
    throw new TypeError(`데이터베이스 연결 실패`);
  } catch (error) {
    // 개선: 민감한 정보를 로그나 응답에 포함하지 않음
    console.error("데이터베이스 연결 오류 발생");
    // 사용자에게는 일반적인 오류 메시지만 반환
    return { success: false, error: "서비스에 일시적인 문제가 발생했습니다. 나중에 다시 시도해주세요." };
  }
}

// 2. 스택 트레이스 보호
function processUserData(userData) {
  try {
    // 의도적으로 오류 발생
    const result = userData.nonExistentMethod();
    return result;
  } catch (error) {
    // 개선: 개발 환경에서만 스택 트레이스 로깅, 프로덕션에서는 숨김
    const isDevEnvironment = process.env.NODE_ENV === 'development';
    
    if (isDevEnvironment) {
      console.error("개발 환경 디버깅 정보:", error.stack);
    } else {
      console.error("사용자 데이터 처리 오류");
    }
    
    // 클라이언트에게는 최소한의 정보만 제공
    return { success: false, error: "요청을 처리할 수 없습니다." };
  }
}

// 3. 적절한 예외 처리로 서비스 안정성 확보
function validateUserInput(input) {
  try {
    const parsedData = JSON.parse(input);
    return parsedData.isValid;
  } catch (error) {
    // 개선: 예외를 적절히 처리하여 서비스 중단 방지
    console.error("입력값 파싱 오류:", error.name);
    return false; // 기본값 반환으로 안전하게 처리
  }
}

// 4. 중첩된 호출에서 안전한 예외 처리
function innerFunction(data) {
  // 데이터 유효성 검사
  if (!data || !data.id) {
    throw new SyntaxError("INVALID_DATA");
  }
  
  // 민감한 정보 없이 표준화된 에러 코드 사용
  if (data.id < 0) {
    throw new RangeError("ACCESS_DENIED");
  }
  
  return data.id;
}

function middleFunction(userId) {
  try {
    const id = innerFunction({ id: userId });
    return id * 2;
  } catch (error) {
    // 중간 계층에서 에러 처리 및 변환
    if (error.message === "INVALID_DATA") {
      throw new TypeError("VALIDATION_ERROR");
    }
    throw error; // 다른 에러는 상위로 전파
  }
}

function outerFunction(userId) {
  try {
    return middleFunction(userId);
  } catch (error) {
    // 개선: 표준화된 에러 코드를 사용자 친화적 메시지로 변환
    let userMessage = "요청을 처리하는 중 오류가 발생했습니다.";
    
    if (error.message === "VALIDATION_ERROR") {
      userMessage = "유효하지 않은 사용자 ID입니다.";
    } else if (error.message === "ACCESS_DENIED") {
      userMessage = "해당 리소스에 접근 권한이 없습니다.";
    }
    
    console.error("오류 발생:", error.message);
    return { error: userMessage };
  }
}

// 실행 예시
console.log("--------------------------------");
console.log("1. 안전한 에러 메시지 처리");
console.log(connectToDatabase("admin", "supersecret123"));

console.log("\n--------------------------------");
console.log("2. 보호된 스택 트레이스");
console.log(processUserData({}));

console.log("\n--------------------------------");
console.log("3. 적절한 예외 처리로 서비스 안정성 확보");
console.log(validateUserInput("잘못된 JSON"));

console.log("\n--------------------------------");
console.log("4. 중첩된 호출에서 안전한 예외 처리");
console.log(outerFunction(-5)); // 민감한 정보 노출 없음