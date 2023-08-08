import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'font_previews';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table
        .integer('font_file_id')
        .unsigned()
        .notNullable()
        .references('font_files.id')
        .onDelete('CASCADE');
      table
        .integer('font_script_id')
        .unsigned()
        .notNullable()
        .references('font_scripts.id')
        .onDelete('CASCADE');
      table
        .integer('image_id')
        .unsigned()
        .notNullable()
        .references('images.id')
        .onDelete('CASCADE');

      table.unique(['font_file_id', 'font_script_id']);

      table.timestamp('created_at').notNullable().defaultTo(this.raw('CURRENT_TIMESTAMP'));
      table.timestamp('updated_at').notNullable().defaultTo(this.raw('CURRENT_TIMESTAMP'));
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
