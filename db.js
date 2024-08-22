const mongoose = require("mongoose");
const dotenv = require('dotenv')
dotenv.config()

const mongoURI = process.env.MONGODB_CONNECT_URI

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
};

module.exports = connectToMongo;