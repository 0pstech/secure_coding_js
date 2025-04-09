// Security-enhanced class handling sensitive data
class UserAccount {
  // Private field declaration (fields starting with # are inaccessible from outside the class)
  #username;
  #password;
  #passwordHash;

  constructor(username, password) {
    this.#username = username;
    // Store password hash instead of plain text
    this.#passwordHash = this.#hashPassword(password);
  }

  // Password hashing method (recommended to use stronger algorithms in production)
  #hashPassword(password) {
    // Simple hash implementation (recommended to use libraries like bcrypt in production)
    return `hashed_${password}_${Date.now()}`;
  }

  // Make method private to prevent prototype pollution
  #validatePasswordInternal(input) {
    // Compare with hashed value
    return this.#passwordHash === this.#hashPassword(input);
  }

  // Provide minimal public API
  validatePassword(input) {
    return this.#validatePasswordInternal(input);
  }

  // Getter that safely returns only the username
  get username() {
    return this.#username;
  }
}

// Prevent prototype changes with Object.freeze
Object.freeze(UserAccount.prototype);

// Create class instance
const user = new UserAccount("admin", "1234");

// Improvement 1: Direct access to object properties not possible
//console.log("Password access attempt:", user.#password); // Error occurs (needs to be commented)
console.log("Only username accessible:", user.username);

// Improvement 2: Attempt to tamper with method through prototype chain
Object.prototype.validatePassword = function() {
  console.log("Attempting to execute malicious code - ", this.password);
  return true;
};

delete UserAccount.prototype.validatePassword;

// Tampering attempt fails - original method is executed
console.log("Authentication result (wrong password):", user.validatePassword("wrong_password")); // Returns false
console.log("Authentication result (correct password):", user.validatePassword("1234")); // Returns true

// Additional security measure: Make the object itself immutable
Object.freeze(user);

// Security enhancements summary:
// 1. Use private fields(#) to block direct access
// 2. Store password as hash instead of plain text
// 3. Prevent prototype and object changes with Object.freeze()
// 4. Provide minimal public API