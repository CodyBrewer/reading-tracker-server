const db = require('../../config/db')

const getBy = (filter) => db('reading_list_books').where(filter).select('*')

const getByBookId = (book_id) =>
  db('reading_list_books').where({ book_id }).first().select('*')

const addBook = (book_id, reading_list_id) =>
  db('reading_list_books').insert({ book_id, reading_list_id }).select('*')

module.exports = {
  addBook,
  getBy,
  getByBookId
}
