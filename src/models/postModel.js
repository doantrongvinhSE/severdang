const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  link: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  feedback: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updatedAt', // map đúng với cột trong DB
    defaultValue: new Date()
  },
  is_running: {
    type: DataTypes.BOOLEAN,
    field: 'is_running',
    defaultValue: true
  },
  id_user: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users', // tên bảng users
      key: 'id'
    }
  }
}, {
  tableName: 'posts',
  timestamps: false // bảng này bạn định nghĩa sẵn updatedAt, không dùng createdAt/updatedAt mặc định
});



module.exports = Post;
