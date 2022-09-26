const express = require("express");
const cors = require("cors");

const {
  getAllUser,
  deleteUser,
  blockUser,
  signIn,
  signUp,
  blockMany,
  deleteMany,
} = require("../controllers/users");

const router = express();

router
  .get("/users", getAllUser)
  .post("/users/signUp", signUp)
  .post("/users/signIn", signIn)
  .put("/users", blockUser)
  .put("/users/many", blockMany)
  .delete("/users/many", deleteMany)
  .delete("/users/:id", deleteUser);

module.exports = router;
