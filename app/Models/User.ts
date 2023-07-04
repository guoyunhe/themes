import Hash from '@ioc:Adonis/Core/Hash';
import {
  BelongsTo,
  HasMany,
  ManyToMany,
  beforeSave,
  belongsTo,
  column,
  hasMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm';
import Image from './Image';
import Model from './Model';
import Post from './Post';
import Tag from './Tag';

export default class User extends Model {
  @column()
  public avatarId: number | null;

  @column()
  public name: string;

  @column()
  public username: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public rememberMeToken: string | null;

  @column()
  public role: string | null;

  @column()
  public locale: string | null;

  @column()
  public description: string | null;

  @belongsTo(() => Image, { foreignKey: 'avatarId' })
  public avatar: BelongsTo<typeof Image>;

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>;

  @manyToMany(() => Tag, {
    pivotTable: 'user_tags',
  })
  public tags: ManyToMany<typeof Tag>;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
