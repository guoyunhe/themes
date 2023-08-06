import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Model from './Model';
import User from './User';

export default class FontLike extends Model {
  @column()
  public userId: number;

  @column()
  public fontId: number;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;
}
