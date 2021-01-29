exports.seed = (knex) =>
  knex('authors')
    .del()
    .then(() =>
      knex('authors').insert([
        { name: 'William Shakespeare' },
        { name: 'Herman Melville' },
        { name: 'Mark Adams' },
        { name: 'Raymond Chandler' }
      ])
    )
