const postService = require('../services/postService');


const getAllPosts = async (req, res, next) => {
    try {
        const { hasFeedback, sort } = req.query;

        const posts = await postService.getAllPosts({
            hasFeedback: hasFeedback === 'true',
            sort: sort || 'updatedAt'
        });

        return res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const createPost = async (req, res) => {
    try {
        const { name, link, id_user } = req.body;

        if (!name || !link || !id_user) {
            return res.status(400).json({ message: "Missing required fields", data: null });
        }

        const newPost = await postService.createPost({
            name,
            link,
            id_user
        });


        if (!newPost) {
            return res.status(400).json({ message: "Failed to create post", data: newPost });
        }

        return res.status(201).json({
            message: "Post created successfully",
            data: newPost
        });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({
                message: "Duplicate value. Link or Feedback must be unique.",
                data: null
            });
        }

        console.error("Error creating post:", error);
        return res.status(500).json({ message: "Internal server error", data: null });
    }
};



const deletePostById = async (req, res, next) => {
    try {
        const result = await postService.deletePostById(Number(req.params.id));
        if (!result) return res.status(404).json({ success: false, message: 'POST not found' });
        res.json({ success: true, message: 'POST deleted', data: result });
    } catch (err) { next(err); }
}

const getPostIdByLink = async (req, res) => {
    const { link } = req.body;

    // Kiểm tra xem link có hợp lệ không
    if (!link || typeof link !== 'string') {
        return res.status(400).json({ success: false, message: 'Invalid link provided', data: null });
    }

    try {
        // Gọi dịch vụ để lấy ID bài viết
        const result = await postService.getPostIdByLink(link);

        if (!result) {
            return res.status(404).json({ success: false, message: 'Post ID not found' });
        }

        // Trả về kết quả thành công
        res.json({ success: true, message: 'POST ID found', postId: result });
    } catch (err) {
        // Gọi middleware xử lý lỗi
    }
};


const updatePostById = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_running, updatedAt, name, link } = req.body;
        const updated = await postService.updatePostById(id, { is_running, updatedAt, name, link });

        if (!updated) {
            return res.status(404).json({ success: false, message: 'POST not found' });
        }

        res.json({ success: true, message: 'POST updated', data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const getAllNamePost = async (req, res) => {
    const posts = await postService.getAllNamePost();
    res.json({ success: true, message: 'POSTs found', data: posts });
}


const getAllCommentsByPostId = async (req, res) => {
    const { postId } = req.params;
    const comments = await postService.getAllCommentsByPostId(postId);
    res.json({ success: true, message: 'Comments found', data: comments });
}

const getIdByIdPost = async (req, res) => {
    const { postId } = req.params;
    try {
        const id = await postService.getIdByIdPost(postId);
        res.json({ success: true, message: 'ID found', data: id });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Id not found' });
    }
    
}

module.exports = {
    getAllPosts,
    createPost,
    deletePostById ,
    getPostIdByLink,
    updatePostById,
    getAllNamePost,
    getAllCommentsByPostId,
    getIdByIdPost
};