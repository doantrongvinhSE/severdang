const express = require('express');
const router = express.Router();
const controller = require("../controllers/postController");

router.get('/', controller.getAllPosts);
router.post('/', controller.createPost);
router.get('/id/:postId', controller.getIdByIdPost);
router.delete('/:id', controller.deletePostById);
router.get('/post-id', controller.getPostIdByLink);
router.put('/:id', controller.updatePostById);
router.get('/names', controller.getAllNamePost);
router.get('/comments/:postId', controller.getAllCommentsByPostId);
module.exports = router;

