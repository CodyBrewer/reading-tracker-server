const db = require('../../config/db')

const create = (list) => db('reading_lists').insert(list).returning('*')

const getAll = () => db('reading_lists').select('*')

const getAllBy = (filter) => db('reading_lists').where(filter).select('*')

const getById = (id) => db('reading_lists').where({ id }).first().select('*')

const update = (id, changes) => {
  return db('reading_lists').where({ id }).first().update(changes).returning('*')
}

const remove = async (id) => {
  const list = await getById(id)
  await db('reading_lists').where({ id }).first().delete()
  return list
}

const getListBooks = (listId) =>
  db('reading_list_books')
    .join('books', 'reading_list_books.book_id', 'books.id')
    .where({ reading_list_id: listId })
    .select('books.*')

const getBooksAuthors = (bookId) =>
  db('author_books')
    .where({ book_id: bookId })
    .join('authors', 'authors.id', 'author_books.author_id')
    .select('authors.name')

const createReadingListObject = async (list) => {
  let books = await getListBooks(list.id)
  if (books.length != null) {
    books = await Promise.all(
      books.map(async (book) => {
        const authors = await getBooksAuthors(book.id)
        const authorNames = authors.map((author) => author.name)
        return { ...book, authors: authorNames }
      })
    )
    return { ...list, books }
  }
  return { ...list, books: [] }
}

module.exports = {
  create,
  getAll,
  getAllBy,
  getById,
  getListBooks,
  getBooksAuthors,
  update,
  remove,
  createReadingListObject
}
