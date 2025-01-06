const Product = require("../models/Product");
const Variables = require("../config/constant");
const ResponseHelper = require("../helpers/ResponseHelper");
module.exports = {
  getProduct: async (req, res) => {
    try {
      const productId = req.query.id;
      const product = await Product.findById(productId)
        .populate("subcategory", "name") // Populate `subcategory` with `name`
        .exec();

      if (!product) {
        return res
          .status(404)
          .json(ResponseHelper.badResponse("Product not found"));
      }

      return res.status(200).json(
        ResponseHelper.successResponse({
          _id: product._id,
          name: product.name,
          image: product.images[0] || "",
          price: product.price,
          stock: product.stock,
          category: product.subcategory._id,
        })
      );
    } catch (err) {
      console.log(err);
      return res.status(500).json(ResponseHelper.badResponse(err));
    }
  },
  getMutalProduct: async (req, res) => {
    try {
      const products = await Product.find({
        subcategory: req.query.category,
      });
      const items = [];
      products.forEach((product) => {
        items.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "https://via.placeholder.com/150", // Default placeholder
        });
      });
      return res.status(200).json(ResponseHelper.successResponse(items));
    } catch (err) {
      console.log(err);
      return res.status(500).json(ResponseHelper.badResponse(err));
    }
  },
};
