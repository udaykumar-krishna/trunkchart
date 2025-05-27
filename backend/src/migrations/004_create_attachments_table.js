exports.up = function (knex) {
    return knex.schema.createTable('attachments', (table) => {
        table.uuid('id').primary();
        table.uuid('message_id').notNullable();
        table.uuid('user_id').notNullable();
        table.string('name').notNullable();
        table.string('type').notNullable();
        table.string('url').notNullable();
        table.integer('size').notNullable();
        table.timestamp('uploaded_at').defaultTo(knex.fn.now());

        table.foreign('message_id').references('messages.id').onDelete('CASCADE');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('attachments');
};
