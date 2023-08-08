import { column } from '@ioc:Adonis/Lucid/Orm';
import Model from './Model';

export default class FontScript extends Model {
  @column()
  public fontId: number;

  @column()
  public tag: string;

  @column({ consume: (value) => JSON.parse(value), prepare: (value) => JSON.stringify(value) })
  public script: any;
}
