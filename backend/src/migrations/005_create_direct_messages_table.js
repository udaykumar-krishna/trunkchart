exports.up = function (knex) {
    return knex.schema.createTable('direct_messages', (table) => {
        table.uuid('id').primary();
        table.uuid('workspace_id').notNullable();
        table.uuid('sender_id').notNullable();
        table.uuid('receiver_id').notNullable();
        table.text('content').notNullable();
        table.boolean('is_read').defaultTo(false);
        table.timestamp('timestamp').defaultTo(knex.fn.now());

        table.foreign('workspace_id').references('workspaces.id').onDelete('CASCADE');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('direct_messages');
};

