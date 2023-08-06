import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'review_images';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table
        .integer('review_id')
        .unsigned()
        .notNullable()
        .references('reviews.id')
        .onDelete('CASCADE');
      table
        .integer('image_id')
        .unsigned()
        .notNullable()
        .references('images.id')
        .onDelete('CASCADE');

      table.unique(['review_id', 'image_id']);

      table.timestamp('created_at').notNullable().defaultTo(this.raw('CURRENT_TIMESTAMP'));
      table.timestamp('updated_at').notNullable().defaultTo(this.raw('CURRENT_TIMESTAMP'));
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
