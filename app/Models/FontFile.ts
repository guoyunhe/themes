import Env from '@ioc:Adonis/Core/Env';
import { column, computed } from '@ioc:Adonis/Lucid/Orm';
import driveConfig from 'Config/drive';
import Model from './Model';

export default class FontFile extends Model {
  @column()
  public fontId: number;

  @column()
  public family: string;

  @column()
  public familyZh: string;

  @column()
  public subFamily: string;

  @column()
  public version: string;

  @column({ consume: (value) => JSON.parse(value), prepare: (value) => JSON.stringify(value) })
  public fvar: any;

  @column()
  public filename: string;

  @column()
  public size: number;

  @column()
  public md5: number;

  @computed()
  public get path(): string {
    return `fonts/${this.id}/${this.filename}`;
  }

  @computed()
  public get url(): string {
    return `${Env.get('SITE_URL')}${driveConfig.disks.local.basePath}/${this.path}`;
  }
}
