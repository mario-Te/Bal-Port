const mongoose = require("mongoose");

// Connection URI
const uri = "mongodb://127.0.0.1:27017/Bal_Port";

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
