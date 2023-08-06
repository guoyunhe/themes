import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'font_files';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.integer('font_id').unsigned().nullable().references('fonts.id').onDelete('CASCADE');

      table.string('family').notNullable().index();
      table.string('family_zh').nullable().index();
      table.string('sub_family').notNullable().index();
      table.string('sub_family_zh').nullable().index();
      table.string('version').nullable().index();

      table.json('fvar').nullable();

      table.string('filename').notNullable().index();
      table.integer('size').unsigned().notNullable().index();
      table.string('md5').notNullable().index();

      table.timestamp('created_at').notNullable().defaultTo(this.raw('CURRENT_TIMESTAMP'));
      table.timestamp('updated_at').notNullable().defaultTo(this.raw('CURRENT_TIMESTAMP'));
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
