exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('ideas', function(table) {
      table.increments('id').primary();
      table.string('img').notNullable();
      table.string('adj').notNullable();
      table.string('adjDef').notNullable();
      table.string('noun').notNullable();
      table.string('nounDef').notNullable();
      table.dateTime('created');
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('ideas'),
  ]);
};
