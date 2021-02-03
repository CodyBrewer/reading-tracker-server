exports.up = (knex) =>
  knex.schema.table('users', (table) => table.boolean('public').defaultTo(true))

exports.down = (knex) =>
  knex.schema.table('users', (table) => table.dropColumn('public'))
