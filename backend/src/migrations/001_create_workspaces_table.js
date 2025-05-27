exports.up = function (knex) {
    return knex.schema.createTable('workspaces', (table) => {
        table.uuid('id').primary();
        table.string('name').notNullable();
        table.text('description');
        table.string('subdomain').notNullable().unique();
        table.uuid('owner_id').notNullable(); // assuming owner userId
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('workspaces');
};
