exports.up = (knex) =>
  knex.schema.createTable('reading_list_books', (table) => {
    table.increments('id');
    table
      .integer('reading_list_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('reading_lists')
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

exports.down = (knex) => knex.schema.dropTableIfExists('reading_list_books');
