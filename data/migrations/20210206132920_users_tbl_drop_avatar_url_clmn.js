exports.up = (knex) =>
  knex.schema.alterTable('users', (table) => {
    table.dropColumn('avatar_url')
  })

exports.down = (knex) =>
  knex.schema.alterTable('users', (table) => {
    table.string('avatar_url').notNullable()
  })
