exports.seed = (knex) =>
  // Deletes ALL existing entries
  knex('reading_list_books')
    .del()
    .then(() =>
      // Inserts seed entries
      knex('reading_list_books').insert([
        { id: 0, reading_list_id: 0, book_id: 0 },
        { id: 1, reading_list_id: 1, book_id: 1 },
        { id: 2, reading_list_id: 2, book_id: 2 },
        { id: 3, reading_list_id: 3, book_id: 3 },
        { id: 4, reading_list_id: 4, book_id: 1 },
        { id: 5, reading_list_id: 5, book_id: 2 },
        { id: 6, reading_list_id: 6, book_id: 2 },
        { id: 7, reading_list_id: 7, book_id: 1 },
        { id: 8, reading_list_id: 8, book_id: 3 },
      ]),
    );
