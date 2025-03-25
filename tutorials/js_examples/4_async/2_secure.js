let accessToken = null;

async function fetchAccessToken() {
  // 비동기적으로 토큰을 받아온다고 가정 (예: 외부 인증 서버 호출)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("valid_token");
    }, 1000); // 토큰 발급에 더 오래 걸리도록 시간 증가
  });
}

async function performSensitiveOperation() {
  // 토큰 갱신 여부를 체크하고 민감 작업을 수행함
  if (!accessToken) {
    console.error("Access denied: 토큰이 없습니다.");
    return;
  }
  console.log("Performing sensitive operation with token:", accessToken);
}

async function main() {
  try {
    // 토큰을 비동기적으로 가져오고 완료될 때까지 기다림
    accessToken = await fetchAccessToken();
    console.log("토큰이 설정되었습니다:", accessToken);
    
    // 토큰이 설정된 후에만 민감 작업 실행
    await performSensitiveOperation();
    console.log("main 함수 실행 완료 - 사용자에게 결과를 안전하게 반환함");
  } catch (error) {
    console.error("오류 발생:", error);
  }
}

// async 함수는 Promise를 반환하므로 적절한 에러 처리 추가
main().catch(error => {
  console.error("치명적 오류:", error);
});
