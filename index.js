const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/users");
const dotenv = require("dotenv");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
dotenv.config();

const URI = process.env.MONGO_URI;

mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
  },
  () => {
    console.log("Mongo db connected successfully");
  }
);

app.use(userRoutes);

app.listen(8080, () => {
  console.log("Backend is running on port 8080");
});
