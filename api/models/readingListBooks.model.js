const db = require('../../config/db')
const { get } = require('./authors.model')

const getBy = (filter) => db('reading_list_books').where(filter).select('*')

const getByBookId = (book_id) => db('reading_list_books').where({ book_id }).first().select('*')

const addBook = (book_id, reading_list_id) =>
  db('reading_list_books').insert({ book_id, reading_list_id }).select('*')

const changeReadingList = async (book_id, reading_list_id, to_list_id) => {
  const [bookListItem] = await getBy({ book_id, reading_list_id })
  return db('reading_list_books')
    .where({ id: bookListItem.id })
    .update({ reading_list_id: to_list_id })
    .returning('*')
}

const remove = async (book_id, reading_list_id) => {
  const [book] = await getBy({ book_id, reading_list_id })
  await db('reading_list_books').where({ id: book.id }).first().delete()
  return book
}

module.exports = {
  addBook,
  getBy,
  getByBookId,
  changeReadingList,
  remove
}
