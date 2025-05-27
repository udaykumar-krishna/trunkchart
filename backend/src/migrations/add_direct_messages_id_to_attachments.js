exports.up = function (knex) {
    return knex.schema.alterTable('attachments', (table) => {
        table.uuid('direct_message_id').nullable();
        table.foreign('direct_message_id').references('direct_messages.id').onDelete('CASCADE');
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('attachments', (table) => {
        table.dropForeign(['direct_message_id']);
        table.dropColumn('direct_message_id');
    });
};