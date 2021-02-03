exports.seed = async (knex) => {
  // reset ids
  await knex.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE reading_lists RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE books RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE reading_list_books RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE authors RESTART IDENTITY CASCADE')
  await knex.raw('TRUNCATE TABLE author_books RESTART IDENTITY CASCADE')
}
