const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/users");
const dotenv = require("dotenv");
const app = express();

app.use(cors({ credentials: true, origin: "*", optionSuccessStatus: 200 }));

app.use(express.json());
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

app.listen(3001, () => {
  console.log("Backend is running on port 3001");
});
