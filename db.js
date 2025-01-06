const mongoose = require("mongoose");

// Connection URI
console.log(process.env.DB_URL);
const uri = process.env.DB_URL;

async function connectToMongoDB() {
  try {
    // Connect to MongoDB
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected successfully to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongoDB();
