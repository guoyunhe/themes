import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'review_likes';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table
        .integer('review_id')
        .unsigned()
        .notNullable()
        .references('reviews.id')
        .onDelete('CASCADE');
      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE');

      table.unique(['review_id', 'user_id']);

      table.timestamp('created_at').notNullable().defaultTo(this.raw('CURRENT_TIMESTAMP'));
      table.timestamp('updated_at').notNullable().defaultTo(this.raw('CURRENT_TIMESTAMP'));
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
