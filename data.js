const mongoose = require("mongoose");
const Category = require("./libs/models/Category"); // Adjust the path as needed
const Subcategory = require("./libs/models/SubCategory");
const Product = require("./libs/models/Product");

// MongoDB Connection
const DB_URI = "mongodb://localhost:27017/Bal_Port"; // Update as needed
mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Alcohol Data
const alcoholData = [
  {
    category: "Tequila",
    subcategory: "Tequila",
    name: "Sauza Hornitos Plata Tequila (50 ml)",
    price: 2.99,
    imageUrl:
      "https://img.cdn4dd.com/p/fit=cover,width=1200,height=1200,format=auto,quality=50/media/photos/08212fae-5bac-482c-8a66-18963bfc0cd4-retina-large-jpeg",
  },
  {
    category: "Tequila",
    subcategory: "Tequila",
    name: "Sauza Hornitos Plata Tequila (200 ml)",
    price: 7.99,
    imageUrl:
      "https://img.cdn4dd.com/p/fit=cover,width=1200,height=1200,format=auto,quality=50/media/photos/7d34e784-6561-49e1-bb9d-12e145faac65-retina-large-jpeg",
  },
  {
    category: "Tequila",
    subcategory: "Anejo",
    name: "Hornitos Anejo Tequila (750 ml)",
    price: 29.99,
    imageUrl:
      "https://img.cdn4dd.com/p/fit=cover,width=1200,height=1200,format=auto,quality=50/media/photos/e558bd34-c424-42f2-be7a-f3ca6897ac84-retina-large-jpeg",
  },
  // Add more products from your list
];

async function populateData() {
  try {
    // Add Category
    const tequilaCategory = await Category.findOneAndUpdate(
      { name: "Tequila" },
      { name: "Tequila", description: "All Tequila products." },
      { upsert: true, new: true }
    );

    // Add Subcategories
    const tequilaSubcategory = await Subcategory.findOneAndUpdate(
      { name: "Tequila", category: tequilaCategory._id },
      { name: "Tequila", category: tequilaCategory._id },
      { upsert: true, new: true }
    );

    const anejoSubcategory = await Subcategory.findOneAndUpdate(
      { name: "Anejo", category: tequilaCategory._id },
      { name: "Anejo", category: tequilaCategory._id },
      { upsert: true, new: true }
    );

    // Add Products
    for (const item of alcoholData) {
      const subcategory =
        item.subcategory === "Anejo"
          ? anejoSubcategory._id
          : tequilaSubcategory._id;

      await Product.create({
        name: item.name,
        price: item.price,
        description: `A delicious ${item.subcategory} tequila.`,
        category: tequilaCategory._id,
        subcategory: subcategory,
        images: [item.imageUrl],
        stock: Math.floor(Math.random() * 50) + 10, // Random stock between 10-50
      });
    }

    console.log("Data populated successfully!");
    process.exit();
  } catch (error) {
    console.error("Error populating data:", error);
    process.exit(1);
  }
}

populateData();
