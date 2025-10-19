require('dotenv').config();
const { Sequelize } = require('sequelize');

// Tạo instance Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,       // tên database
  process.env.DB_USER,       // user
  process.env.DB_PASSWORD,   // password
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',        // vì bạn đang dùng MySQL
    logging: false,          // bật log SQL (true) nếu cần debug
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Hàm test connection


module.exports = sequelize;
