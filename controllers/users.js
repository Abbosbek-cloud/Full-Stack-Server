const UsersModel = require("../models/Users");
const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/auth");
const UserModel = require("../models/Users");

async function getAllUser(req, res) {
  const users = await UsersModel.find({});
  console.log(users);
  res.send(users);
}

async function getUserById(req, res) {
  const _id = req.params.id;
  let user = await UsersModel.find({ _id });

  res.send({ message: "User", data: user[0] });
}

async function signIn(req, res) {
  if (req.body.password && req.body.email) {
    const user = await UsersModel.findOne({}).or([{ email: req.body.email }]);
    if (user && user.isBlocked === true) {
      res.status(400).send({
        message: "Your account is blocked",
      });
    } else {
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = signToken(user);
        let lastLog = new Date();
        user.lastLog = lastLog;
        user.timeStamp = user.timeStamp;
        res.send({
          token,
          user,
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

    if (existUser.length) {
      res
        .status(400)
        .send({ message: "This is user is exist with this email!" });
    } else {
      const enteredDate = new Date();
      const salt = bcrypt.genSaltSync(10);

      const newUser = new UsersModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isBlocked: false,
        timeStamp: enteredDate,
        lastLog: enteredDate,
      });

      await newUser.save();

      const hashPassword = bcrypt.hashSync(req.body.password, salt);

      newUser.password = hashPassword;

      const savedUser = await newUser.save();

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
  console.log(req.body);
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

async function blockMany(req, res) {
  const { users = [] } = req.body;
  console.log("body", req.body);
  const blockedUsers = [];
  try {
    if (users.length) {
      for (let i = 0; i < users.length; i++) {
        const user = await UsersModel.findById(users[i]);
        user.isBlocked = !user.isBlocked;
        const editedUser = await user.save();
        const token = signToken(editedUser);
        blockedUsers.push({ token, editedUser });
      }
      console.log("worked");
      res.status(200).send(blockedUsers);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
}

async function deleteMany(req, res) {
  const { users = [] } = req.body;
  const deletedUsers = [];
  try {
    if (users.length) {
      for (let i = 0; i < users.length; i++) {
        const deletedUser = await UsersModel.findByIdAndRemove(users[i]).exec();
        deletedUsers.push(deletedUser);
      }
      res
        .status(200)
        .send({ message: "Users successfully deleted!", deletedUsers });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
}

module.exports = {
  getAllUser,
  getUserById,
  signUp,
  deleteUser,
  blockUser,
  signIn,
  blockMany,
  deleteMany,
};
