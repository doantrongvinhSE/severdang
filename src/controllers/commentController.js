const commentService = require('../services/commentService');


const getAllComments = async (req, res) => {
    try {
        const { sort, page = 1, limit = 10, phone } = req.query;
        
        // Chuyển đổi page và limit thành số
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        
        // Validate tham số
        if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
            return res.status(400).json({ 
                success: false, 
                message: 'Page phải >= 1, limit phải từ 1-100' 
            });
        }
        
        // Xử lý filter phone
        const filterPhone = phone === 'true';
        
        const result = await commentService.getAllComments({ 
            sort: sort || 'timestamp',
            page: pageNum,
            limit: limitNum,
            filterPhone: filterPhone
        });
        
        res.json({ 
            success: true, 
            data: result.comments,
            pagination: {
                currentPage: pageNum,
                totalPages: result.totalPages,
                totalItems: result.totalItems,
                itemsPerPage: limitNum,
                hasNextPage: pageNum < result.totalPages,
                hasPrevPage: pageNum > 1
            }
        });
    } catch (err) { 
        res.status(500).json({ success: false, message: err.message });
     }
};

const createComment = async (req, res) => {
    try {
        const { id, uid, fb_name, content, phone, timestamp, status, id_post } = req.body;
        const comment = await commentService.createComment({ id, uid, fb_name, content, phone, timestamp, status, id_post });
        res.json({ success: true, data: comment });
    } catch (err) { 
        res.status(500).json({ success: false, message: err.message });
     }
};


const findCommentById = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await commentService.findCommentById(id);
        if (!comment) return res.status(200).json({ success: false});
        res.status(200).json({ success: true });
    } catch (err) { 
        res.status(200).json({ success: false });
     }
    
};

const getCountCommentToday = async (req, res) => {
    try {
        const count = await commentService.getCountCommentToday();
        res.json({ success: true, data: count });
    } catch (err) { 
        res.status(200).json({ success: false });
     }
};



const updateStatusComment = async (req, res) => {
    try {
        const { id, status } = req.body;

        if (status !== 'normal' && status !== 'fail' && status !== 'success') {
            return res.status(200).json({ success: false, message: 'Status is not valid' });
        }

        const comment = await commentService.updateStatusComment(id, status);
        res.json({ success: true, data: comment });
    } catch (err) { 
        res.status(200).json({ success: false, message: err.message });
     }
};


module.exports = { getAllComments, createComment, findCommentById, getCountCommentToday, updateStatusComment };
