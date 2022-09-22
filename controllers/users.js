const UsersModel = require("../models/Users");
const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/auth");
const UserModel = require("../models/Users");

async function getAllUser(req, res) {
  UsersModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    }

    res.send(result);
  });
}

async function getUserById(req, res) {
  const _id = req.params.id;
  let user = await UsersModel.find({ _id });

  res.send({ message: "User", data: user[0] });
}

async function signIn(req, res) {
  if (req.body.password && req.body.email) {
    const user = await UsersModel.findOne({});
    if (user && user.isBlocked === false) {
      res.status(400).send({
        message: "Your account is blocked",
      });
    } else {
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = signToken(user);
        res.send({
          token,
          _id: user._id,
          name: user.name,
          username: user.username,
          isAdmin: user.isAdmin,
          status: user.status,
        });
      } else {
        res.status(401).send({ message: "Email or password is incorrect!" });
      }
    }
  } else {
    res.status(400).send({
      message: "Login or password is not full!",
    });
  }
}

async function signUp(req, res) {
  let existUser = null;
  try {
    existUser = await UserModel.find({ email: req.body.email });

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, salt);
    if (existUser.length) {
      res
        .status(400)
        .send({ message: "This is user is exist with this email!" });
    } else {
      const newUser = new UsersModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isBlocked: false,
      });

      await newUser.save();
      const savedUser = await newUser.save();

      newUser.password = hashPassword;
      const token = signToken(savedUser);

      res.status(200).send({
        token,
        savedUser,
      });
    }
  } catch (error) {
    let errMsg;

    if (error.code == 11000) {
      errMsg = Object.keys(error.keyValue)[0];

      if (errMsg === "phone") {
        errMsg = "Bu telefon raqamdan oldin foydalanilgan!";
      } else if (errMsg === "email") {
        errMsg = "Bu logindan oldin foydalanilgan!";
      }
    } else {
      errMsg = error.message;
    }
    res.status(400).json({ message: errMsg });
  }
}

async function blockUser(req, res) {
  try {
    const user = await UsersModel.findById(req.body._id);
    user.isBlocked = user.isBlocked ? false : true;
    const editedUser = await user.save();
    const token = signToken(editedUser);
    res.send({ token, isBlocked: editedUser.isBlocked });
  } catch (error) {
    res.send(error);
  }
}

async function deleteUser(req, res) {
  const _id = req.params.id;
  const deletedUser = await UsersModel.findByIdAndRemove(_id).exec();
  res.send({ message: "User deleted", data: deletedUser });
}

module.exports = {
  getAllUser,
  getUserById,
  signUp,
  deleteUser,
  blockUser,
  signIn,
};
