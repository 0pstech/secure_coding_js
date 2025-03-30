// Node.js 구 버전 취약점 예시
// 1. 정규식 DoS 취약점 (ReDoS, CVE-2019-15604, Node.js v12.8.0 이하)
function regexDosVulnerability() {
  console.log("Node.js v12.8.0 이하에서는 정규식 엔진의 취약점으로 인한 DoS 공격에 취약합니다.");
  
  // 취약한 정규식 패턴 예시
  const vulnerablePattern = /^(([a-z])+.)+[A-Z]([a-z])+$/;
  
  console.log("취약한 정규식 패턴:", vulnerablePattern);
  console.log("공격 문자열 예시: " + "'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'");
  console.log("이 패턴은 백트래킹을 과도하게 발생시켜 CPU를 100% 사용하게 만들 수 있습니다.");
}

// Nullish Coalescing Operator (??)는 ES2020에서 도입된 연산자로,
// 왼쪽 피연산자가 null 또는 undefined일 때만 오른쪽 피연산자를 반환합니다.
// 이는 || 연산자와 달리 '', 0, false 등의 falsy 값을 유효한 값으로 취급합니다.
// 이 연산자는 기본값을 설정할 때 매우 유용하며, 특히 0이나 빈 문자열이 
// 유효한 값으로 처리되어야 하는 경우에 적합합니다.
console.log("\n2. Nullish Coalescing Operator");
function nullishCoalescing() {
  // || 사용 예시: 0이 falsy이므로 대체값 반환
  const value1 = 0 || 42; // 결과: 42
  // ?? 사용 예시: 0은 유효한 값으로 취급
  const value2 = 0 ?? 42; // 결과: 0

  console.log(value1, value2);
}

console.log('--------------------------------');
console.log("\n1. 정규식 DoS 취약점 (ReDoS, CVE-2019-15604, Node.js v12.8.0 이하)");
regexDosVulnerability();
console.log('--------------------------------');
console.log("\n2. Nullish Coalescing Operator");
nullishCoalescing();
console.log('--------------------------------');
