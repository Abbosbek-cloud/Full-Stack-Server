const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UsersModel = require("./models/Users");
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

app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  const users = new UsersModel({
    name,
    email,
    password,
  });

  try {
    let database = await users.save();
    res.send({
      message: "User added to database",
      database,
    });
  } catch (error) {
    res.send(error);
  }
});

app.get("/users", async (req, res) => {
  UsersModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    }

    res.send(result);
  });
});

app.put("/users", async (req, res) => {
  const { name, email, password, _id } = req.body;

  try {
    UsersModel.findById(_id, (err, updatedUser) => {
      updatedUser.name = name;
      updatedUser.email = email;
      updatedUser.password = password;
      if (err) {
        res.send(err);
      } else {
        updatedUser.save();
        res.send({ message: "user updated", data: updatedUser });
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.delete("/users/:id", async (req, res) => {
  const _id = req.params.id;
  const deletedUser = await UsersModel.findByIdAndRemove(_id).exec();

  res.send({ message: "User deleted", data: deletedUser });
});

app.listen(3002, () => {
  console.log("Backend is running on port 3002");
});
