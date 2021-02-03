const db = require('../../config/db')
const BooksModel = require('./books.model')

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

const createReadingListObject = async (list) => {
  let books = await getListBooks(list.id)
  if (books.length != null) {
    books = await Promise.all(
      books.map(async (book) => {
        return await BooksModel.createBookObject(book)
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
  update,
  remove,
  createReadingListObject
}
