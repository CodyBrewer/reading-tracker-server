const db = require('../../config/db');

const create = (list) => db('reading_lists').insert(list).returning('*');

const getAll = () => db('reading_lists').select('*');

const getAllBy = (filter) => db('reading_lists').where(filter).select('*');

const getById = (id) => db('reading_lists').where({ id }).select('*');

const update = (id, changes) => {
  db('reading_lists').where({ id }).update(changes).returning('*');
};

const remove = (id) => {
  db('reading_lists').where({ id }).first().delete();
};

const getListBooks = (listId) => db('reading_list_books')
  .join('books', 'reading_list_books.book_id', 'books.id')
  .where({ reading_list_id: listId })
  .select('books.*');

module.exports = {
  create,
  getAll,
  getAllBy,
  getById,
  getListBooks,
  update,
  remove,
};
