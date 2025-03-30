// 잘못된 에러 처리 및 예외 처리로 인한 보안 문제 예시

// 1. 민감한 정보가 포함된 에러 메시지 노출
function connectToDatabase(username, password) {
  try {
    // 데이터베이스 연결 시도 (실제로는 실패한다고 가정)
    throw new Error(`데이터베이스 연결 실패: 사용자 ${username}, 비밀번호 ${password}로 연결 시도`);
  } catch (error) {
    // 문제: 에러 메시지에 민감한 정보가 그대로 노출됨
    console.error(error.message);
    return { success: false, error: error.message }; // 민감한 정보가 클라이언트에게 전달됨
  }
}

// 2. 스택 트레이스 노출로 인한 내부 구조 유출
function processUserData(userData) {
  try {
    // 의도적으로 오류 발생
    const result = userData.nonExistentMethod();
    return result;
  } catch (error) {
    // 문제: 전체 스택 트레이스가 노출됨
    console.error("오류 발생:", error.stack);
    return { success: false, error: error.stack }; // 내부 코드 구조가 클라이언트에게 노출됨
  }
}

// 3. 예외 처리 부재로 인한 서비스 중단 취약점
function validateUserInput(input) {
  // 예외 처리 없음 - 잘못된 입력이 들어오면 애플리케이션이 중단될 수 있음
  const parsedData = JSON.parse(input); // 잘못된 JSON 형식이면 예외 발생
  return parsedData.isValid;
}

// 4. 중첩된 호출에서 예외 처리 문제
function innerFunction(data) {
  // 예외를 발생시키지만 처리하지 않음
  if (!data || !data.id) {
    throw new Error("유효하지 않은 데이터");
  }
  
  // 민감한 정보를 포함한 에러 발생
  if (data.id < 0) {
    throw new Error(`시스템 경로: C:/users/admin/secure_app/${data.id}, 접근 거부됨`);
  }
  
  return data.id;
}

function middleFunction(userId) {
  // 예외를 처리하지 않고 상위 함수로 전파
  const id = innerFunction({ id: userId });
  return id * 2;
}

function outerFunction(userId) {
  try {
    return middleFunction(userId);
  } catch (error) {
    // 문제: 내부 함수에서 발생한 민감한 정보가 포함된 에러가 
    // 여러 계층을 거쳐 최종적으로 여기서 노출됨
    console.error("처리 중 오류 발생:", error.message);
    return { error: error.message }; // 민감한 정보가 응답에 포함됨
  }
}

// 실행 예시
console.log("--------------------------------");
console.log("1. 민감한 정보가 포함된 에러 메시지 노출");
console.log(connectToDatabase("admin", "supersecret123"));

console.log("\n--------------------------------");
console.log("2. 스택 트레이스 노출로 인한 내부 구조 유출");
console.log(processUserData({}));

console.log("\n--------------------------------");
console.log("3. 예외 처리 부재로 인한 서비스 중단 취약점");
try {
  console.log(validateUserInput("잘못된 JSON"));
} catch (e) {
  console.log("validateUserInput 함수가 예외 처리를 하지 않아 애플리케이션이 중단될 수 있습니다.");
}

console.log("\n--------------------------------");
console.log("4. 중첩된 호출에서 예외 처리 문제");
console.log(outerFunction(-5)); // 민감한 시스템 경로 정보가 노출됨
