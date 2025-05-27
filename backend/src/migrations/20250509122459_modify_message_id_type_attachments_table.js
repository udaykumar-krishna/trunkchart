/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('attachments', (table) => {
    table.uuid('message_id').nullable().alter(); // Make message_id nullable
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('attachments', (table) => {
    table.uuid('message_id').notNullable().alter(); // Set message_id back to NOT NULL
  });
};
