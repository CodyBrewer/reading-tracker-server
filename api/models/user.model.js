const db = require('../../config/db')

const getUserPassword = (filter) =>
  db('users').where(filter).first().select('uuid', 'password')

const getUserBy = (filter) =>
  db('users')
    .where(filter)
    .first()
    .select('uuid', 'username', 'avatar_url', 'public')

const getAllPublic = () =>
  db('users').where({ public: true }).select('uuid', 'username', 'avatar_url')

const create = async (user) => {
  const inserted = await db('users').insert(user)
  if (inserted) {
    return getUserBy({ uuid: user.uuid })
  }
}

module.exports = {
  getUserBy,
  getUserPassword,
  getAllPublic,
  create
}
