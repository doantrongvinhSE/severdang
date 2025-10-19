const OrderModel = require("../models/orderModel");


const getAllOrders = async () => {
    const orders = await OrderModel.findAll({
      order: [['createdAt', 'DESC']]
    });
    return orders;
  };

const createOrder = async ({ product_name, customer_name, phone, address, note }) => {
    const newOrder = await OrderModel.create({
        product_name,
        customer_name,
        phone,
        address,
        createdAt: new Date(),
        note
    });
    return newOrder;
};

const updateOrderById = async (id, { product_name, customer_name, phone, address, note }) => {
    const order = await OrderModel.findByPk(id);
    if (!order) return null;
    await order.update({ product_name, customer_name, phone, address, note });
    return order.get({ plain: true });
};

const deleteOrderById = async (id) => {
    const order = await OrderModel.findByPk(id);
    if (!order) return null;
    await order.destroy();
    return order.get({ plain: true });
};



module.exports = {
    getAllOrders,
    createOrder,
    updateOrderById,
    deleteOrderById
};
