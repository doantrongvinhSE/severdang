const express = require('express');
const router = express.Router();
const controller = require("../controllers/commentController");

router.get('/', controller.getAllComments);
router.post('/', controller.createComment);
router.get('/count-today', controller.getCountCommentToday);
router.get('/:id', controller.findCommentById);
router.put('/update', controller.updateStatusComment);

module.exports = router;

