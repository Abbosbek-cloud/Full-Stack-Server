const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/users");
const app = express();

const URI = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://abek01:Az_161203_oK@cluster0.jtmcbhm.mongodb.net/users?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  },
  () => {
    console.log("Mongo db connected successfully");
  }
);

app.use(userRoutes);

app.listen(3002, () => {
  console.log("Backend is running on port 3002");
});
