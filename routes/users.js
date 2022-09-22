const express = require("express");
const {
  getAllUser,
  getUserById,
  postUser,
  deleteUser,
  blockUser,
} = require("../controllers/users");
const UsersModel = require("../models/Users");
// instance of express
const router = express();

router
  .get("/users", getAllUser)
  .get("/users/:id", getUserById)
  .post("/users", postUser)
  .put("/users", blockUser)
  .delete("/users/:id", deleteUser);

module.exports = router;
