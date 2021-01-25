exports.up = (knex) => knex.schema.createTable('author_books', (table) => {
  table.increments('id');
  table
    .integer('author_id')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('authors')
    .onDelete('CASCADE')
    .onUpdate('CASCADE');
  table
    .integer('book_id')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('books')
    .onDelete('CASCADE')
    .onUpdate('CASCADE');
});

exports.down = (knex) => knex.schema.dropTableIfExists('author_books');
