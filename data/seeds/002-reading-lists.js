exports.seed = (knex) =>
  // Deletes ALL existing entries
  knex('reading_lists')
    .del()
    .then(() =>
      // insert entries
      knex('reading_lists').insert([
        { id: 0, user_id: '1d9dd170-8757-40ec-9ccf-11e4e3de27b1', name: 'read' },
        { id: 1, user_id: '1d9dd170-8757-40ec-9ccf-11e4e3de27b1', name: 'to-read' },
        { id: 2, user_id: '1d9dd170-8757-40ec-9ccf-11e4e3de27b1', name: 'reading' },
        { id: 3, user_id: '7a97e42c-124c-4e2c-8109-c5ce6e5f77a4', name: 'read' },
        { id: 4, user_id: '7a97e42c-124c-4e2c-8109-c5ce6e5f77a4', name: 'to-read' },
        { id: 5, user_id: '7a97e42c-124c-4e2c-8109-c5ce6e5f77a4', name: 'reading' },
        { id: 6, user_id: '1e4d861c-d301-4318-9fd6-96ccbec9f821', name: 'read' },
        { id: 7, user_id: '1e4d861c-d301-4318-9fd6-96ccbec9f821', name: 'to-read' },
        { id: 8, user_id: '1e4d861c-d301-4318-9fd6-96ccbec9f821', name: 'reading' },
      ]),
    );
