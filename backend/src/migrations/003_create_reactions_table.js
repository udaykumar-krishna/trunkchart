exports.up = function (knex) {
    return knex.schema.createTable('reactions', (table) => {
        table.uuid('id').primary();
        table.uuid('message_id').notNullable();
        table.uuid('user_id').notNullable();
        table.string('emoji').notNullable();
        table.timestamp('timestamp').defaultTo(knex.fn.now());

        table.foreign('message_id').references('messages.id').onDelete('CASCADE');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('reactions');
};
