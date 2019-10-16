exports.up = async (knex) => {
  await knex.schema
    .createTable('user', (t) => {
      t.increments('id')
        .primary()
      t.string('username', 100)
        .notNull()
      t.string('password', 100)
        .notNull()
    })

  await Promise.all([
    knex.schema.createTable('image', (t) => {
      t.increments('id')
        .primary()
      t.string('name', 100)
        .notNull()
      t.string('path', 100)
        .notNull()
      t.integer('user', 11)
        .unsigned()
        .notNull()
        .references('id')
        .inTable('user')
    }),
    knex.schema.createTable('link', (t) => {
      t.increments('id')
        .primary()
      t.string('name', 100)
        .notNull()
      t.string('path', 100)
        .notNull()
      t.string('url')
        .notNull()
      t.integer('user', 11)
        .unsigned()
        .notNull()
        .references('id')
        .inTable('user')
    }),
    knex.schema.createTable('paste', (t) => {
      t.increments('id')
        .primary()
      t.string('name', 100)
        .notNull()
      t.string('path', 100)
        .notNull()
      t.string('preview', 100)
        .notNull()
      t.integer('user', 11)
        .unsigned()
        .notNull()
        .references('id')
        .inTable('user')
    }),
    knex.schema.createTable('api-key', (t) => {
      t.increments('id')
        .primary()
      t.string('key', 100)
        .notNull()
      t.bool('isValid')
        .notNull()
        .default(true)
      t.integer('user', 11)
        .unsigned()
        .notNull()
        .references('id')
        .inTable('user')
    }),
    knex.schema.createTable('request', (t) => {
      t.increments('id')
        .primary()
      t.string('ip', 100)
        .notNull()
      t.string('url', 100)
        .notNull()
      t.integer('user', 11)
        .unsigned()
        .references('id')
        .inTable('user')
    })
  ])
  await Promise.all([
    knex.schema.createTable('request-image', (t) => {
      t.increments('id')
        .primary()
      t.integer('image', 11)
        .unsigned()
        .notNull()
        .references('id')
        .inTable('image')
      t.integer('request', 11)
        .unsigned()
        .notNull()
        .references('id')
        .inTable('request')
    }),
    knex.schema.createTable('request-link', (t) => {
      t.increments('id')
        .primary()
      t.integer('link', 11)
        .unsigned()
        .notNull()
        .references('id')
        .inTable('link')
      t.integer('request', 11)
        .unsigned()
        .notNull()
        .references('id')
        .inTable('request')
    }),
    knex.schema.createTable('request-paste', (t) => {
      t.increments('id')
        .primary()
      t.integer('paste', 11)
        .unsigned()
        .notNull()
        .references('id')
        .inTable('paste')
      t.integer('request', 11)
        .unsigned()
        .notNull()
        .references('id')
        .inTable('request')
    })
  ])
}

exports.down = async (knex) => {
  return knex.schema
    .dropTable('request-image')
    .dropTable('request-link')
    .dropTable('request-paste')
    .dropTable('image')
    .dropTable('link')
    .dropTable('paste')
    .dropTable('request')
    .dropTable('api-key')
    .dropTable('user')
}
