const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const requiredUserInfo = ['uuid', 'username', 'email', 'password', 'avatar_url'];

const verifyUserBody = (req, res, next) => {
  requiredUserInfo.forEach((property) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, property)) {
      const error = new Error();
      error.statusCode = 400;
      error.message = `Missing Required user property: ${property}`;
      next(error);
    }
  });
  req.user = req.body;
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
      const error = new Error(err);
      error.statusCode(500);
      error.message = 'Error hashing password';
    }
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  const secret = process.env.JWT_SECRET || 'this should be a secret environment variable';

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        const error = new Error(err);
        error.statusCode = 401;
        error.message = 'Invalid Token';
        next(error);
      }
      req.decodedToken = decodedToken;
      next();
    });
  }
  const error = new Error();
  error.statusCode(400);
  error.message = 'No token provided in authorization header';
};

module.exports = {
  verifyUserBody,
  hashPassword,
  verifyToken,
};
