const Order = require("../models/orderModel");

const orderController = {};
const orderController2 = {};
const orderController3 = {};

orderController.get = async (req, res) => {
  const orders = await Order.find({}).populate("user");
  res.send(orders);
};

orderController2.get = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
};

orderController3.get = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id });
  if (order) {
    res.send(order);
  } else {
    res.status(404).send("Order Not Found.");
  }
};

orderController.destroy = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id });
  if (order) {
    const deletedOrder = await order.remove();
    res.status(201).send({ message: "Order Deleted", data: deletedOrder });
  } else {
    res.status(404).send("Order Not Found.");
  }
};

orderController.post = async (req, res) => {
  const newOrder = new Order({
    orderItems: req.body.orderItems,
    user: req.user._id,
    shipping: req.body.shipping,
    payment: req.body.payment,
    itemsPrice: req.body.itemsPrice,
    taxPrice: req.body.taxPrice,
    shippingPrice: req.body.shippingPrice,
    totalPrice: req.body.totalPrice,
  });
  const newOrderCreated = await newOrder.save();

  if (newOrderCreated) {
    return res
      .status(201)
      .send({ message: "New Order Created", data: newOrderCreated });
  } else {
    return res.status(500).send({ message: " Error in Creating Order." });
  }
};

orderController.update = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.payment = {
      paymentMethod: "paypal",
      paymentResult: {
        payerID: req.body.payerID,
        orderID: req.body.orderID,
        paymentID: req.body.paymentID,
      },
    };
    const updatedOrder = await order.save();
    res.send({ message: "Order Paid.", order: updatedOrder });
  } else {
    res.status(404).send({ message: "Order not found." });
  }
};

module.exports = { orderController, orderController2, orderController3 };
