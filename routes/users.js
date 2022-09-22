const express = require("express");
const UsersModel = require("../models/Users");
// instance of express
const router = express();

router
  .get("/users", async (req, res) => {
    UsersModel.find({}, (err, result) => {
      if (err) {
        res.send(err);
      }

      res.send(result);
    });
  })
  .get("/users/:id", async (req, res) => {
    const _id = req.params.id;
    let user = await UsersModel.find({ _id });

    res.send({ message: "User", data: user[0] });
  })
  .post("/users", async (req, res) => {
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
  })
  .put("/users", async (req, res) => {
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
  })
  .delete("/users/:id", async (req, res) => {
    const _id = req.params.id;
    const deletedUser = await UsersModel.findByIdAndRemove(_id).exec();

    res.send({ message: "User deleted", data: deletedUser });
  });

module.exports = router;
