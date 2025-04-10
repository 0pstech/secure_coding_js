const pool = require('../config/database');

const userModel = {
  // Create a new user
  async create({ username, password, email }) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
        [username, password, email]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error in userModel.create:', error);
      throw error;
    }
  },

  // Find user by username
  async findByUsername(username) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return rows[0];
    } catch (error) {
      console.error('Error in userModel.findByUsername:', error);
      throw error;
    }
  },

  // Find user by email
  async findByEmail(email) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error('Error in userModel.findByEmail:', error);
      throw error;
    }
  },

  // Find user by ID
  async findById(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error in userModel.findById:', error);
      throw error;
    }
  },

  // Get all users
  async getAllUsers() {
    try {
      const [rows] = await pool.query('SELECT id, username, email, is_admin, created_at FROM users');
      return rows;
    } catch (error) {
      console.error('Error in userModel.getAllUsers:', error);
      throw error;
    }
  },

  // Get user by ID (keeping for backward compatibility)
  async getUserById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error in userModel.getUserById:', error);
      throw error;
    }
  },

  // Delete user
  async deleteUser(id) {
    try {
      const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in userModel.deleteUser:', error);
      throw error;
    }
  }
};

module.exports = { userModel };