// src/models/CookieToken.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CookieToken = sequelize.define('CookieToken', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  cookie: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  isRunning: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: 'is_running',
    defaultValue: true
  }
}, {
  tableName: 'cookie_token',
  timestamps: false
});

module.exports = CookieToken;
