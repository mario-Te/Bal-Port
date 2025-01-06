const mongoose = require("mongoose");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Product = require("../models/Product");
const ResponseHelper = require("../helpers/ResponseHelper");

module.exports = {
  getCategories: async (req, res) => {
    try {
      // Fetch all categories
      const categories = await Category.find();

      // Map through categories to structure the response
      const result = await Promise.all(
        categories.map(async (category) => {
          // Fetch subcategories for each category
          const subcategories = await Subcategory.find({
            category: category._id,
          });

          // Fetch products for each subcategory
          const items = [];
          for (const subcategory of subcategories) {
            const products = await Product.find({
              subcategory: subcategory._id,
            });

            products.forEach((product) => {
              items.push({
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || "https://via.placeholder.com/150", // Default placeholder
              });
            });
          }

          return {
            name: category.name,
            items,
          };
        })
      );

      return res.status(200).json(ResponseHelper.successResponse(result));
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to fetch categories with items", error });
    }
  },
};
