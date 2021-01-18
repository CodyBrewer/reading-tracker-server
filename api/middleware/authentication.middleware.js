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
  const bearerHeader = req.headers.authorization;
  if (bearerHeader !== undefined) {
    const bearerToken = bearerHeader.split(' ')[1];
    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err !== null) {
        res.status(401).json({ error: 'Invalid token' });
      } else {
        req.profile = { username: decodedToken.username, uuid: decodedToken.uuid };
        next();
      }
    });
  } else {
    res.status(403).json({ error: 'missing authorization header' });
  }
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
