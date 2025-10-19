const commentService = require('../services/commentService');


const getAllComments = async (req, res) => {
    try {
        const { sort } = req.query;
        const comments = await commentService.getAllComments({ sort: sort || 'timestamp' });
        res.json({ success: true, data: comments });
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
