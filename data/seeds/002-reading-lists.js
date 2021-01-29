exports.seed = (knex) =>
  // Deletes ALL existing entries
  knex('reading_lists')
    .del()
    .then(() =>
      // insert entries
      knex('reading_lists').insert([
        { user_id: '1d9dd170-8757-40ec-9ccf-11e4e3de27b1', name: 'read' },
        { user_id: '1d9dd170-8757-40ec-9ccf-11e4e3de27b1', name: 'to-read' },
        { user_id: '1d9dd170-8757-40ec-9ccf-11e4e3de27b1', name: 'reading' },
        { user_id: '7a97e42c-124c-4e2c-8109-c5ce6e5f77a4', name: 'read' },
        { user_id: '7a97e42c-124c-4e2c-8109-c5ce6e5f77a4', name: 'to-read' },
        { user_id: '7a97e42c-124c-4e2c-8109-c5ce6e5f77a4', name: 'reading' },
        { user_id: '1e4d861c-d301-4318-9fd6-96ccbec9f821', name: 'read' },
        { user_id: '1e4d861c-d301-4318-9fd6-96ccbec9f821', name: 'to-read' },
        { user_id: '1e4d861c-d301-4318-9fd6-96ccbec9f821', name: 'reading' }
      ])
    )
