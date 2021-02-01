exports.up = (knex) =>
  knex.schema.createTable('reading_lists', (table) => {
    table.increments('id')
    table.uuid('user_id').unsigned().index().references('uuid').inTable('users')
    table.text('name').notNullable()
  })

exports.down = (knex) => {
  knex.schema.dropTableIfExists('reading_lists')
}
