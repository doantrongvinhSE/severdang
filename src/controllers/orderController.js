const orderService = require('../services/orderService');

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.json({ success: true, data: orders });
    } catch (err) { 
        res.status(500).json({ success: false, message: err.message });
     }
};

const createOrder = async (req, res) => {
    try {
        const { product_name, customer_name, phone, address, note } = req.body;
        const order = await orderService.createOrder({ product_name, customer_name, phone, address, note });
        res.json({ success: true, data: order });
    } catch (err) { 
        res.status(500).json({ success: false, message: err.message });
     }
};

const updateOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_name, customer_name, phone, address, note } = req.body;
        const order = await orderService.updateOrderById(id, { product_name, customer_name, phone, address, note });
        res.json({ success: true, data: order });
    } catch (err) { 
        res.status(500).json({ success: false, message: err.message });
     }
};

const deleteOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await orderService.deleteOrderById(id);
        if (!order) return res.status(404).json({ success: false });
        res.json({ success: true, data: order });
    } catch (err) { 
        res.status(500).json({ success: false, message: err.message });
     }
};

module.exports = { getAllOrders, createOrder, updateOrderById, deleteOrderById };