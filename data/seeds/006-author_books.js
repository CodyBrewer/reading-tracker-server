exports.seed = (knex) =>
  knex('author_books')
    .del()
    .then(() =>
      knex('author_books').insert([
        { book_id: 1, author_id: 1 },
        { book_id: 2, author_id: 2 },
        { book_id: 3, author_id: 3 },
        { book_id: 4, author_id: 4 }
      ])
    )
