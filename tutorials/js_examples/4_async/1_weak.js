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

function main() {
  // 토큰 갱신 비동기 작업 시작 - Promise를 기다리지 않음
  fetchAccessToken().then(token => {
    accessToken = token;
    console.log("토큰이 설정되었습니다:", token);
  });
  
  // await 없이 즉시 민감 작업 실행 - 레이스 컨디션 발생
  performSensitiveOperation();
  console.log("main 함수 실행 완료 - 사용자에게 이미 결과를 반환함");
}

main();
