const express = require("express");
const router = express.Router();
const {
  signUpValidation,
  isAuth,
  isAdmin,
} = require("../middlewares/userMiddleware");

const {
  productController,
  productController2,
} = require("../controllers/productController");
const { userController } = require("../controllers/userController");
const {
  orderController,
  orderController2,
  orderController3,
} = require("../controllers/orderController");

// Users Routes
router.post("/register", signUpValidation, userController.register);
router.post("/login", userController.login);
router.put("/users/:id", isAuth, userController.update);
router.get("/createadmin", userController.get);

// -------------- Product Routes -------------- //
router.get("/products", productController.get);
router.get("/products/:id", productController2.get);
router.post("/products/create", isAuth, isAdmin, productController.post);
router.put("/products/update/:id", isAuth, isAdmin, productController.update);
router.delete(
  "/products/delete/:id",
  isAuth,
  isAdmin,
  productController.destroy
);
router.post("/products/:id/reviews", isAuth, productController2.post);

// -------------- order Routes -------------- //
router.get("/orders", isAuth, orderController.get);
router.get("/orders/mine", isAuth, orderController2.get);
router.get("/orders/:id", isAuth, orderController3.get);
router.post("/orders/create", isAuth, orderController.post);
router.put("/orders/:id/pay", isAuth, orderController.update);
router.delete("/orders/delete/:id", isAuth, isAdmin, orderController.destroy);

module.exports = router;
