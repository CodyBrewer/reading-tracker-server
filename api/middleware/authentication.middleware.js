const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const UserModel = require('../models/user.model');

const requiredUserInfo = ['username', 'email', 'password', 'avatar_url'];

const verifyUserRegisterBody = (req, res, next) => {
  requiredUserInfo.forEach((property) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, property)) {
      const error = new Error();
      error.statusCode = 400;
      error.message = `Missing Required user property: ${property}`;
      next(error);
    }
  });
  req.user = req.body;
  req.user.uuid = uuidv4();
  next();
};

const hashPassword = async (req, res, next) => {
  if (req.user) {
    try {
      const hash = await bcrypt.hash(req.user.password, Number(process.env.SALT));
      if (hash !== req.user.password) {
        req.user.password = hash;
        next();
      }
    } catch (err) {
      const error = new Error('Error hashing password');
      res.status(500);
      next(error);
    }
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  const secret = process.env.JWT_SECRET || 'this should be a secret environment variable';

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        const error = new Error('invalid token');
        res.status(401);
        next(error);
      }
      req.decodedToken = decodedToken;
      next();
    });
  }
  const error = new Error('No token provided in authorization header');
  res.status(400);
  next(error);
};

const verifyUserLogin = async (req, res, next) => {
  const { username, password } = req.body;

  if (username && password) {
    try {
      const user = await UserModel.getUserBy({ username });
      if (user) {
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          const error = new Error('Incorrect username or password');
          res.status(401);
          next(error);
        }
        req.user = { username, password: user.password, uuid: user.uuid };
        next();
      }
      const error = new Error('Incorrect username or password');
      res.status(401);
      next(error);
    } catch (error) {
      next(error);
    }
  }
  const error = new Error('Username or password field missing from body');
  res.status(400);
  next(error);
};

module.exports = {
  verifyUserRegisterBody,
  hashPassword,
  verifyToken,
  verifyUserLogin,
};
