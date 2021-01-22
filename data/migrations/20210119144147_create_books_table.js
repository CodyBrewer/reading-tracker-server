exports.up = (knex) =>
  knex.schema.createTable('books', (table) => {
    table.increments('id');
    table.text('google_id');
    table.text('title');
    table.text('cover_image');
    table.text('description');
    table.integer('page_count');
    table.integer('printed_page_count');
  });

exports.down = (knex) => knex.schema.dropTableIfExists('books');
