const jwt = require("jsonwebtoken");

const signToken = (user) => {
  return jwt.sign(
    {
      name: user.name,
      email: user.email,
      password: user.password,
      isBlocked: user.isBlocked,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "30d",
    }
  );
};

const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    // Bearer xxxx => xxxx
    const token = authorization.slice(4, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Token is invalid!" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "Token is not exist!" });
  }
};

const isAdmin = async (req, res, next) => {
  isAuth(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(401).send({ message: "User admin emas" });
    }
  });
};

module.exports = { signToken, isAuth, isAdmin };
