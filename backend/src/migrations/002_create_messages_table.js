exports.up = function (knex) {
    return knex.schema.createTable('messages', (table) => {
      table.uuid('id').primary();
      table.uuid('channel_id'); // optional
      table.uuid('user_id').notNullable();
      table.text('content').notNullable();
      table.boolean('is_edited').defaultTo(false);
      table.uuid('parent_id'); // optional (threaded message)
      table.timestamp('timestamp').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('messages');
  };
  