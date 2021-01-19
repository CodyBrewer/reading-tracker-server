exports.seed = (knex) => {
  // Deletes ALL existing entries
  knex('reading_lists')
    .del()
    .then(() => {
      // insert entries
      knex('reading_lists').insert([
        { id: 0, user_id: 0, name: 'read' },
        { id: 1, user_id: 0, name: 'to-read' },
        { id: 2, user_id: 0, name: 'reading' },
        { id: 3, user_id: 1, name: 'read' },
        { id: 4, user_id: 1, name: 'to-read' },
        { id: 5, user_id: 1, name: 'reading' },
        { id: 6, user_id: 2, name: 'read' },
        { id: 7, user_id: 2, name: 'to-read' },
        { id: 8, user_id: 2, name: 'reading' },
      ]);
    });
};
