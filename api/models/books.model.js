const db = require('../../config/db')

const getBy = (filter) => db('books').where(filter).select('*')

const create = (book) => db('books').insert(book).returning('*')

const update = (id, changes) => db('reading_lists').where({ id }).update(changes).returning('*')

const remove = (id) => db('books').where({ id }).first().delete()

const getBooksAuthors = (bookId) =>
  db('author_books')
    .where({ book_id: bookId })
    .join('authors', 'authors.id', 'author_books.author_id')
    .select('authors.name')

const createBookObject = async (book) => {
  const booksAuthors = await getBooksAuthors(book.id)
  const authors = booksAuthors.map((author) => author.name)
  return { ...book, authors }
}

module.exports = {
  getBy,
  create,
  update,
  remove,
  createBookObject
}
