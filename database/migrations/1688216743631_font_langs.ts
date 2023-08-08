import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'font_langs';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table
        .integer('font_file_id')
        .unsigned()
        .notNullable()
        .references('font_files.id')
        .onDelete('CASCADE');

      table.string('lang').notNullable().index();

      table.unique(['font_file_id', 'lang']);

      table.text('preview', 'longtext').nullable();

      table.timestamp('created_at').notNullable().defaultTo(this.raw('CURRENT_TIMESTAMP'));
      table.timestamp('updated_at').notNullable().defaultTo(this.raw('CURRENT_TIMESTAMP'));
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
