const CommentModel = require("../models/commentModel");
const { Op, QueryTypes } = require("sequelize");
const sequelize = require('../config/database');
const moment = require('moment-timezone');

const PostModel = require('../models/postModel');

const getAllComments = async ({ sort = 'timestamp', page = 1, limit = 10, filterPhone = false } = {}) => {
  // Danh sách các field được phép sort
  const allowedSortFields = ['timestamp'];

  // Nếu field sort không hợp lệ, fallback về 'timestamp'
  const sortField = allowedSortFields.includes(sort) ? sort : 'timestamp';

  // Tính toán offset cho phân trang
  const offset = (page - 1) * limit;

  // Tạo điều kiện where cho filter phone
  const whereCondition = {};
  if (filterPhone) {
    whereCondition.phone = {
      [Op.and]: [
        { [Op.ne]: null },
        { [Op.ne]: '' } // Cũng loại bỏ chuỗi rỗng
      ]
    };
  }

  // Lấy tổng số bản ghi với filter
  const totalItems = await CommentModel.count({
    where: whereCondition,
    include: [
      {
        model: PostModel,
        as: 'post',
        attributes: []
      }
    ]
  });

  // Lấy dữ liệu với phân trang và filter
  const rows = await CommentModel.findAll({
    where: whereCondition,
    include: [
      {
        model: PostModel,
        as: 'post',
        attributes: ['id', 'name', 'link']
      }
    ],
    order: [[sortField, 'DESC']],
    limit: limit,
    offset: offset
  });

  // Tính tổng số trang
  const totalPages = Math.ceil(totalItems / limit);

  return {
    comments: rows,
    totalItems,
    totalPages,
    currentPage: page,
    itemsPerPage: limit
  };
};



const createComment = async ({ id, uid, fb_name, content, phone, timestamp, status, id_post }) => {
    const newComment = await CommentModel.create({
        id: id,
        uid: uid,
        fb_name: fb_name,
        content,
        phone,
        timestamp: new Date(Number(timestamp) * 1000 + 7 * 60 * 60 * 1000),
        status : status || 'normal',
        id_post
    });
    return newComment.get({ plain: true });
};


const findCommentById = async (id) => {
    const comment = await CommentModel.findByPk(id);
    return comment.get({ plain: true });
};



// Hàm test raw SQL


// Hàm đếm comment theo ngày cụ thể (theo múi giờ VN)
const getCountCommentByDate = async (dateString) => {
    // dateString format: '2024-10-19'
    const startVN = moment.tz(dateString, 'Asia/Ho_Chi_Minh').startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endVN = moment.tz(dateString, 'Asia/Ho_Chi_Minh').endOf('day').format('YYYY-MM-DD HH:mm:ss');

    console.log('Testing with specific date:', { dateString, startVN, endVN });

    try {
        const rows = await sequelize.query(
            'SELECT COUNT(*) AS count FROM comments WHERE timestamp >= ? AND timestamp <= ?',
            {
                replacements: [startVN, endVN],
                type: QueryTypes.SELECT
            }
        );
        return rows[0]?.count ?? 0;
    } catch (error) {
        console.error('Error in getCountCommentByDate:', error);
        return 0;
    }
};

const getCountCommentToday = async () => {
    // Tính theo múi giờ Việt Nam (UTC+7)
    // Ngày 19-10-2024 từ 00:00:00 đến 23:59:59 (giờ VN)
    const startVN = moment().tz('Asia/Ho_Chi_Minh').startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endVN = moment().tz('Asia/Ho_Chi_Minh').endOf('day').format('YYYY-MM-DD HH:mm:ss');

    try {
        const rows = await sequelize.query(
            'SELECT COUNT(*) AS count FROM comments WHERE timestamp >= ? AND timestamp <= ?',
            {
                replacements: [startVN, endVN],
                type: QueryTypes.SELECT
            }
        );

        return rows[0]?.count ?? 0;
    } catch (error) {
        console.error('Error in getCountCommentToday:', error);
        // Fallback về cách cũ nếu raw SQL không hoạt động
        const todayStart = moment().tz('Asia/Ho_Chi_Minh').startOf('day').toDate();
        const todayEnd = moment().tz('Asia/Ho_Chi_Minh').endOf('day').toDate();

        const comments = await CommentModel.count({
            where: {
                timestamp: {
                    [Op.gte]: todayStart,
                    [Op.lte]: todayEnd
                }
            }
        });

        return comments;
    }
};

const updateStatusComment = async (id, status) => {
    const comment = await CommentModel.findByPk(id);
    comment.status = status;
    await comment.save();
    return comment.get({ plain: true });
};



module.exports = {
    getAllComments,
    createComment,
    findCommentById,
    getCountCommentToday,
    updateStatusComment,
    getCountCommentByDate
};
