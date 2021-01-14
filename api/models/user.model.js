const db = require('../../config/db');

const getUserBy = (filter) => db('users').where(filter).first().select('*');

const create = async (user) => {
  const inserted = await db('users').insert(user);
  if (inserted) {
    return getUserBy({ uuid: user.uuid });
  }
};

module.exports = {
  getUserBy,
  create,
};
