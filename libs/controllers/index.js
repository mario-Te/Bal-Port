const express = require("express");
const router = express.Router();
const authController = require("./authController");
const CategoryController = require("./CategoryController");
const ProductController = require("./ProductController");
const CartController = require("./CartController");
const Variables = require("../config/constant");
const { verifyToken } = require("../middleware/JwtToken");

// Auth_Routes
router.post("/auth/register", authController.registerUser);
router.post("/auth/login", authController.LoginUser);
router.get("/products/all", CategoryController.getCategories);
router.get("/product", ProductController.getProduct);
router.get("/mutual-product", ProductController.getMutalProduct);
router.post(
  "/cart",
  verifyToken([Variables.Roles.user]),
  CartController.addToCart
);
router.get(
  "/cart",
  verifyToken([Variables.Roles.user]),
  CartController.getCartItems
);
module.exports = router;
