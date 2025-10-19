const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const PostModel = require('./postModel');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.STRING(500),
    primaryKey: true,
    allowNull: false,
  },
  uid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fb_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('normal', 'fail', 'success'),  // Nếu dùng ENUM
    allowNull: true,
    defaultValue: 'normal',
  },
  id_post: {
    type: DataTypes.STRING(255),
    allowNull: true,
    references: {
      model: 'posts',  // tên bảng posts
      key: 'feedback'
    }
  }
}, {
  tableName: 'comments',
  timestamps: false  // không tự động tạo createdAt/updatedAt
});


Comment.belongsTo(PostModel, {
    foreignKey: 'id_post',
    targetKey: 'feedback',
    as: 'post'
  });

module.exports = Comment;
