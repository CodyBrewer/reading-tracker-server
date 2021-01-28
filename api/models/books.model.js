const db = require('../../config/db')
const AuthorsModel = require('./authors.model')

const getBy = (filter) => db('books').where(filter).select('*')

const create = (book) => db('books').insert(book).returning('*')

const update = (id, changes) =>
  db('reading_lists').where({ id }).update(changes).returning('*')

const remove = (id) => db('books').where({ id }).first().delete()

module.exports = {
  getBy,
  create,
  update,
  remove
}
