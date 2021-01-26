const db = require('../../config/db')

const getUserBy = (filter) => db('users').where(filter).first().select('*')

const getAllPublic = () => db('users').where({ public: true }).select('uuid', 'username')

const create = async (user) => {
  const inserted = await db('users').insert(user)
  if (inserted) {
    return getUserBy({ uuid: user.uuid })
  }
}

module.exports = {
  getUserBy,
  getAllPublic,
  create
}
