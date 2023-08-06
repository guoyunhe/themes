import {
  BelongsTo,
  HasMany,
  ManyToMany,
  belongsTo,
  column,
  computed,
  hasMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm';
import Comment from './Comment';
import FontLike from './FontLike';
import Model from './Model';
import Tag from './Tag';
import User from './User';

export default class Font extends Model {
  @column()
  public userId: number | null;

  @column()
  public family: string;

  @column()
  public familyZh: string | null;

  @column()
  public designer: string | null;

  @column()
  public designerUrl: string | null;

  @column()
  public manufacturer: string | null;

  @column()
  public manufacturerUrl: string | null;

  /**
   * SPDX license code
   * @see https://spdx.org/licenses/
   */
  @column()
  public license: string | null;

  @column()
  public licenseUrl: string | null;

  @column()
  public source: string | null;

  @column()
  public sourceUrl: string | null;

  @column({ consume: (value) => JSON.parse(value), prepare: (value) => JSON.stringify(value) })
  public sourceConfig: any;

  @column()
  public downloads: number;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>;

  @hasMany(() => FontLike)
  public likes: HasMany<typeof FontLike>;

  @manyToMany(() => Tag, {
    pivotTable: 'post_tags',
  })
  public tags: ManyToMany<typeof Tag>;

  @computed()
  public get likesCount(): number | null {
    return this.$extras.likes_count;
  }
}
