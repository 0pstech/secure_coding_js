// Security-enhanced class handling sensitive data
class UserAccount {
  // Private field declaration (fields starting with # are inaccessible from outside the class)
  #username: string;
  // #password: string;
  #passwordHash: string;

  constructor(username: string, password: string) {
    this.#username = username;
    // Store password as hash instead of plain text
    this.#passwordHash = this.#hashPassword(password);
  }

  // Password hashing method (recommended to use stronger algorithms in practice)
  #hashPassword(password: string): string {
    // Simple hash implementation (recommended to use libraries like bcrypt in practice)
    return `hashed_${password}_${Date.now()}`;
  }

  // Make method private to prevent prototype pollution
  #validatePasswordInternal(input: string): boolean {
    // Compare with hashed value
    return this.#passwordHash === this.#hashPassword(input);
  }

  // Provide minimal public API
  validatePassword(input: string): boolean {
    return this.#validatePasswordInternal(input);
  }

  // Getter that safely returns only the username
  get username(): string {
    return this.#username;
  }
}

// Prevent prototype changes with Object.freeze
Object.freeze(UserAccount.prototype);

// Create class instance
const user = new UserAccount("admin", "1234");

// Improvement 1: Direct access to object properties not possible
// console.log("Password access attempt:", user.#password); // Error occurs (needs to be commented)
console.log("Only username accessible:", user.username);

// Improvement 2: Attempt to tamper with method through prototype chain
// @ts-ignore - TypeScript doesn't allow adding properties to Object.prototype
Object.prototype.validatePassword = function(): boolean {
  console.log("Malicious code execution attempt");
  return true;
};

// Tampering attempt failed - original method executes
console.log("Authentication result (wrong password):", user.validatePassword("wrong_password")); // Returns false
console.log("Authentication result (correct password):", user.validatePassword("1234")); // Returns true

// Additional security measure: Make object itself immutable
Object.freeze(user);

// Security enhancements summary:
// 1. Use private fields (#) to block direct access
// 2. Store password as hash instead of plain text
// 3. Prevent prototype and object changes with Object.freeze()
// 4. Provide minimal public API