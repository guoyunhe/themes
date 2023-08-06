import {
  BelongsTo,
  ManyToMany,
  belongsTo,
  column,
  computed,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm';
import Model from './Model';
import User from './User';

export default class Review extends Model {
  @column()
  public userId: number;

  @column()
  public rating: number;

  @column()
  public content: string;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @manyToMany(() => User, {
    pivotTable: 'review_likes',
  })
  public likes: ManyToMany<typeof User>;

  @computed()
  public get likesCount(): number | null {
    return this.$extras.likes_count;
  }
}
