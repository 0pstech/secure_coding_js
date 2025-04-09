const db = require('../config/database');

class User {
  constructor(username, password, email) {
    this.username = username;
    this.password = password;
    this.email = email;
  }

  static async create({ username, password, email }) {
    const [result] = await db.execute(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, password, email]
    );
    return result.insertId;
  }

  static async findByUsername(username) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }
}

module.exports = User; 