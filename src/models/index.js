const sequelize = require('../config/database');
const PostModel = require('./postModel');
const CommentModel = require('./commentModel');

// Define associations
PostModel.hasMany(CommentModel, { foreignKey: 'id_post', as: 'comments' });
CommentModel.belongsTo(PostModel, { foreignKey: 'id_post', as: 'post' });

module.exports = {
  sequelize,
  PostModel,
  CommentModel
};