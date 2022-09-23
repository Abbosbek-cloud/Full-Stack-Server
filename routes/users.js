const express = require("express");
const cors = require("cors");

const {
  getAllUser,
  deleteUser,
  blockUser,
  signIn,
  signUp,
} = require("../controllers/users");

const router = express();

router
  .get("/users", getAllUser)
  .post("/users/signUp", cors(), signUp)
  .post("/users/signIn", cors(), signIn)
  .put("/users", blockUser)
  .delete("/users/:id", deleteUser);

module.exports = router;
