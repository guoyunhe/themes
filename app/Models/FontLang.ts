import { column } from '@ioc:Adonis/Lucid/Orm';
import Model from './Model';

export default class FontLang extends Model {
  @column()
  public fontFileId: number;

  @column()
  public lang: string;

  @column()
  public preview: string;
}
