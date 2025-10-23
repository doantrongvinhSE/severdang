const PostModel = require("../models/postModel");
const CommentModel = require("../models/commentModel");
const axios = require("axios");
const { Op } = require("sequelize");




const getAllPosts = async ({ hasFeedback = false, sort = 'updatedAt' } = {}) => {
  const where = {};

  if (hasFeedback) {
      where.feedback = { [Op.ne]: null };
  }

  const rows = await PostModel.findAll({
      where,
      order: [[sort, 'DESC']],
      raw: true
  });

  // Thêm count_today cho mỗi post
  const postsWithCountToday = await Promise.all(
    rows.map(async (post) => {
      let count_today = 0;
      
      if (post.feedback) {
        // Lấy ngày hôm nay (bắt đầu từ 00:00:00)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Lấy ngày mai (để làm điều kiện <)
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Đếm comment hôm nay cho post này
        const commentCount = await CommentModel.count({
          where: {
            id_post: post.feedback,
            timestamp: {
              [Op.gte]: today,
              [Op.lt]: tomorrow
            }
          }
        });
        
        count_today = commentCount;
      }

      return {
        ...post,
        count_today
      };
    })
  );

  return postsWithCountToday;
};

const createPost = async ({ name, link, id_user }) => {
  let feedback = '';

  const dataPost = await getPostIdByLink(link);
  if (dataPost != null) {
    feedback = dataPost;
  } else {
    feedback = null;
  }

  const newRow = await PostModel.create({
    name,
    link,
    feedback,
    updatedAt: new Date(),   // cập nhật thời gian hiện tại
    is_running: true,        // mặc định true khi tạo mới
    id_user
  });

  // Lấy object plain JS
  return newRow.get({ plain: true });
};

const deleteAllPosts = async () => {
  await PostModel.destroy({ truncate: true, restartIdentity: true });
  return true;
}

const deletePostById = async (id) => {
  const deletedCount = await PostModel.destroy({ where: { id } });
  return deletedCount;
}

const updatePostById = async (id, { is_running, updatedAt, name, link }) => {
  const row = await PostModel.findByPk(id);
  if (!row) return null;
  const toUpdate = {};
  if (is_running !== undefined) toUpdate.is_running = is_running;
  if (updatedAt !== undefined) toUpdate.updatedAt = updatedAt;
  if (name !== undefined) toUpdate.name = name;
  if (link !== undefined) {
    const dataPost = await getPostIdByLink(link);
    toUpdate.link = link;
    toUpdate.feedback = dataPost;
  }
  
  await row.update(toUpdate);
  return row.get({ plain: true });
}

const getPostIdByLink = async (link) => {
  try {
    const response = await axios.get(link, {
      headers: {
        "accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9",
        "sec-fetch-site": "same-origin",

      },
    });

    const html = response.data;

    // Regex để lấy post_id
    const regex = /"subscription_target_id":"(\d+)"/;
    const match = html.match(regex);

    if (match) {
      const subscriptionTargetId = match[1]; // Lấy kết quả phù hợp
      return subscriptionTargetId;
    } else {
      const regex = /"post_id":"(\d+)"/;
      const match = html.match(regex);
      if (match) {
        const subscriptionTargetId = match[1];
        return subscriptionTargetId;
      } else {
        return null;
      }
    }
  } catch (error) {
    return null;
  }
};


const getAllCommentsByPostId = async (postId) => {
  const comments = await CommentModel.findAll({ where: { id_post: postId } });
  return comments;
}

const getIdByIdPost = async (postId) => {
  const post = await PostModel.findOne({ where: { feedback: postId } });
  return post.id;
}




module.exports = {
  getAllPosts,
  createPost,
  deleteAllPosts,
  deletePostById,
  getPostIdByLink,
  updatePostById,
  getAllCommentsByPostId,
  getIdByIdPost,
};