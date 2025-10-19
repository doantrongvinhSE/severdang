const express = require('express');
const router = express.Router();
const controller = require("../controllers/orderController");

router.get('/', controller.getAllOrders);
router.post('/', controller.createOrder);
router.put('/:id', controller.updateOrderById);
router.delete('/:id', controller.deleteOrderById);


module.exports = router;

