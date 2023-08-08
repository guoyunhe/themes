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
import FontFile from './FontFile';
import FontScript from './FontScript';
import Model from './Model';
import Review from './Review';
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

  @hasMany(() => FontFile)
  public files: HasMany<typeof FontFile>;

  @hasMany(() => FontScript)
  public scripts: HasMany<typeof FontScript>;

  @manyToMany(() => User, {
    pivotTable: 'font_likes',
  })
  public likes: ManyToMany<typeof User>;

  @manyToMany(() => Review, {
    pivotTable: 'font_reviews',
  })
  public reviews: ManyToMany<typeof Review>;

  @manyToMany(() => Tag, {
    pivotTable: 'font_tags',
  })
  public tags: ManyToMany<typeof Tag>;

  @computed()
  public get likesCount(): number | null {
    return this.$extras.likes_count;
  }

  @computed()
  public get rating(): number | null {
    return this.$extras.rating;
  }
}
