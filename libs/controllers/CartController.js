const Cart = require("../models/Cart");
const Variables = require("../config/constant");
const ResponseHelper = require("../helpers/ResponseHelper");
module.exports = {
  addToCart: async (req, res) => {
    try {
      const userId = req.id;
      const { productId, quantity, price } = req.body;
      if (!productId || !quantity || !price) {
        return res.status(400).json(ResponseHelper.badResponse("MissingData"));
      }
      let cart = await Cart.findOne({ userId });

      if (!cart) {
        // Create a new cart if none exists
        cart = new Cart({
          userId,
          Products: [],
          totalPrice: 0,
        });
      }

      // Check if the item already exists in the cart
      const existingItemIndex = cart.Products.findIndex(
        (item) => item.ProductId === productId
      );

      if (existingItemIndex > -1) {
        // Update the quantity and price for the existing item
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].price = price; // Assuming price might update
      } else {
        cart.Products.push({ ProductId: productId, quantity, price });
      }

      // Recalculate total price
      cart.totalPrice = cart.Products.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      // Save the updated cart
      await cart.save();

      res.status(200).json(
        ResponseHelper.successResponse({
          message: "Item added to cart successfully.",
          cart,
        })
      );
    } catch (err) {
      console.log(err);
      return res.status(500).json(ResponseHelper.badResponse(err));
    }
  },
  getCartItems: async (req, res) => {
    try {
      const userId = req.id;
      // Find the cart for the user
      const cart = await Cart.findOne({ userId }).populate({
        path: "Products.ProductId",
        model: "Product",
      });

      if (!cart) {
        return res
          .status(404)
          .json(ResponseHelper.badResponse("Cart not found"));
      }

      // Format response with product details
      const cartWithProducts = cart.Products.map((item) => ({
        productId: item.ProductId._id,
        name: item.ProductId.name,
        image: item.ProductId.images?.[0],
        description: item.ProductId.description,
        price: item.ProductId.price,
        quantity: item.quantity,
        totalPrice: item.quantity * item.ProductId.price,
      }));

      res.status(200).json(
        ResponseHelper.successResponse({
          products: cartWithProducts,
          totalPrice: cart.totalPrice,
        })
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json(ResponseHelper.badResponse(error));
    }
  },
};
