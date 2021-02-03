exports.up = (knex) =>
  knex.schema.table('reading_lists', (table) => table.boolean('public').defaultTo(true))

exports.down = (knex) => knex.schema.table('reading_lists', (table) => table.dropColumn('public'))
