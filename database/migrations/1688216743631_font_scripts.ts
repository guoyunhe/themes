import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'font_scripts';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.integer('font_id').unsigned().nullable().references('fonts.id').onDelete('CASCADE');

      table.string('tag').notNullable().index();

      table.unique(['font_id', 'tag']);

      table.json('script').nullable();

      table.timestamp('created_at').notNullable().defaultTo(this.raw('CURRENT_TIMESTAMP'));
      table.timestamp('updated_at').notNullable().defaultTo(this.raw('CURRENT_TIMESTAMP'));
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
