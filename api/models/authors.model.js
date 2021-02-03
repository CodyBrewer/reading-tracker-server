const db = require('../../config/db')

const get = (filter) => db('authors').where(filter).first().select('*')

const getAll = () => db('authors').select('*')

const getAllBy = (filter) => db('authors').where(filter).select('*')

const create = (author) => db('authors').insert(author).returning('*')

const update = (id, changes) =>
  db('authors').where({ id }).update(changes).returning('*')

const remove = (id) => db('authors').where({ id }).first().delete()

module.exports = {
  create,
  get,
  getAll,
  getAllBy,
  update,
  remove
}
