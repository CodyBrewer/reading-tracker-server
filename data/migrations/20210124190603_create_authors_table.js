exports.up = (knex) => knex.schema.createTable('authors', (table) => {
  table.increments('id');
  table.text('name');
});

exports.down = (knex) => knex.schema.dropTableIfExists('authors');
