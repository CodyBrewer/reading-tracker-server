const db = require('../../config/db')

const addBook = (authorId, bookId) =>
  db('author_books')
    .insert({ author_id: authorId, book_id: bookId })
    .returning('*')

const getAuthorBook = (author_id, book_id) => {
  db('author_books').where({ author_id, book_id }).first().select('*')
}

module.exports = {
  addBook,
  getAuthorBook
}
