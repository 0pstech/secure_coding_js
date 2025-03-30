const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Users = require('./users');

const Posts = sequelize.define('Posts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
});

Posts.belongsTo(Users, { foreignKey: 'authorId' });
Users.hasMany(Posts, { foreignKey: 'authorId' });

module.exports = Posts; 