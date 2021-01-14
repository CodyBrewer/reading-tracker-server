const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const payload = {
    uuid: user.uuid,
    username: user.username,
  };

  const options = {
    expiresIn: '1h',
  };

  const secret = process.env.JWT_SECRET || 'this should be a secret environment variable';

  return jwt.sign(payload, secret, options);
};

module.exports = generateToken;
