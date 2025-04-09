const User = require('../models/user');

const authService = {
  login: async (username, password) => {
    // TODO: 실제 로그인 로직 구현
    return { message: '로그인 성공' };
  },

  register: async (username, password, email) => {
    // TODO: 실제 회원가입 로직 구현
    return { message: '회원가입 성공' };
  }
};

module.exports = authService; 