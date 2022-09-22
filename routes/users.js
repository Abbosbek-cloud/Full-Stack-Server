const express = require("express");
const {
  getAllUser,
  deleteUser,
  blockUser,
  signIn,
  signUp,
} = require("../controllers/users");
const UsersModel = require("../models/Users");
// instance of express
const router = express();

router
  .get("/users", getAllUser)
  .post("/users/signUp", signUp)
  .post("/users/signIn", signIn)
  .put("/users", blockUser)
  .delete("/users/:id", deleteUser);

module.exports = router;
