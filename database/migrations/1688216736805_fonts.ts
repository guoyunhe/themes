import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'fonts';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.integer('user_id').unsigned().nullable().references('users.id').onDelete('SET NULL');

      table.string('family').notNullable().index();
      table.string('family_zh').nullable().index();
      table.string('designer').nullable().index();
      table.string('designer_url').nullable();
      table.string('manufacturer').nullable().index();
      table.string('manufacturer_url').nullable();
      table.string('license').nullable();
      table.string('license_url').nullable();

      table.string('source').nullable().index();
      table.string('source_url').nullable();
      table.json('source_config').nullable();

      table.integer('downloads').unsigned().notNullable().index().defaultTo(0);

      table.timestamp('created_at').notNullable().defaultTo(this.raw('CURRENT_TIMESTAMP'));
      table.timestamp('updated_at').notNullable().defaultTo(this.raw('CURRENT_TIMESTAMP'));
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
