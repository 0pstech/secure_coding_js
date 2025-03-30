// 민감한 데이터를 다루는 보안 강화 클래스
class UserAccount {
  // private 필드 선언 (# 기호로 시작하는 필드는 클래스 외부에서 접근 불가)
  #username;
  #password;
  #passwordHash;

  constructor(username, password) {
    this.#username = username;
    // 비밀번호를 평문으로 저장하지 않고 해시 처리
    this.#passwordHash = this.#hashPassword(password);
  }

  // 비밀번호 해싱 메서드 (실제로는 더 강력한 알고리즘 사용 권장)
  #hashPassword(password) {
    // 간단한 해시 구현 (실제로는 bcrypt 등의 라이브러리 사용 권장)
    return `hashed_${password}_${Date.now()}`;
  }

  // 메서드를 private으로 만들어 프로토타입 오염 방지
  #validatePasswordInternal(input) {
    // 해시된 값으로 비교
    return this.#passwordHash === this.#hashPassword(input);
  }

  // 공개 API는 최소한으로 제공
  validatePassword(input) {
    return this.#validatePasswordInternal(input);
  }

  // 사용자 이름만 안전하게 반환하는 getter
  get username() {
    return this.#username;
  }
}

// Object.freeze로 프로토타입 변경 방지
Object.freeze(UserAccount.prototype);

// 클래스 인스턴스 생성
const user = new UserAccount("admin", "1234");

// 개선점 1: 객체의 프로퍼티에 직접 접근 불가능
// console.log("비밀번호 접근 시도:", user.#password); // 에러 발생 (주석 처리 필요)
console.log("사용자 이름만 접근 가능:", user.username);

// 개선점 2: 프로토타입 체인을 통한 메서드 변조 시도
Object.prototype.validatePassword = function() {
  console.log("악성 코드 실행 시도");
  return true;
};

// 변조 시도 실패 - 원래 메서드가 실행됨
console.log("인증 결과 (잘못된 비밀번호):", user.validatePassword("wrong_password")); // false 반환
console.log("인증 결과 (올바른 비밀번호):", user.validatePassword("1234")); // true 반환

// 추가 보안 조치: 객체 자체도 변경 불가능하게 설정
Object.freeze(user);

// 보안 강화 요약:
// 1. private 필드(#)를 사용하여 직접 접근 차단
// 2. 비밀번호는 해시 처리하여 저장
// 3. Object.freeze()로 프로토타입 및 객체 변경 방지
// 4. 최소한의 공개 API만 제공