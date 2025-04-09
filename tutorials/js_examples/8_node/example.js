// Node.js Old Version Vulnerability Example
// 1. Regular Expression DoS Vulnerability (ReDoS, CVE-2019-15604, Node.js v12.8.0 and below)
function regexDosVulnerability() {
  console.log("Node.js v12.8.0 and below are vulnerable to DoS attacks due to regex engine vulnerabilities.");
  
  // Example of vulnerable regex pattern
  const vulnerablePattern = /^(([a-z])+.)+[A-Z]([a-z])+$/;
  
  console.log("Vulnerable regex pattern:", vulnerablePattern);
  console.log("Attack string example: " + "'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!'");
  console.log("This pattern can cause excessive backtracking, leading to 100% CPU usage.");
}

// The Nullish Coalescing Operator (??) was introduced in ES2020.
// It returns the right-hand operand only when the left-hand operand is null or undefined.
// Unlike the || operator, it treats '', 0, false, etc. as valid values.
// This operator is very useful for setting default values, especially when 0 or empty strings
// need to be treated as valid values.
console.log("\n2. Nullish Coalescing Operator");
function nullishCoalescing() {
  const df = 0;
  // || example: 0 is falsy, so returns alternative value
  const value1 = df || 42; // result: 42
  // ?? example: 0 is treated as a valid value
  const value2 = df ?? 42; // result: 0

  console.log(value1, value2);
}

// console.log('--------------------------------');
// console.log("\n1. Regular Expression DoS Vulnerability (ReDoS, CVE-2019-15604, Node.js v12.8.0 and below)");
// regexDosVulnerability();
console.log('--------------------------------');
console.log("\n2. Nullish Coalescing Operator");
nullishCoalescing();
console.log('--------------------------------');
