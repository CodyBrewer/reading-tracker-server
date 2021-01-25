exports.seed = (knex) => knex('authors')
  .del()
  .then(() => knex('authors').insert([
    { id: 0, name: 'William Shakespeare' },
    { id: 1, name: 'Herman Melville' },
    { id: 2, name: 'Mark Adams' },
    { id: 3, name: 'Raymond Chandler' },
  ]));
