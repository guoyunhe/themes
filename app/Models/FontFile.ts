import Env from '@ioc:Adonis/Core/Env';
import { column, computed } from '@ioc:Adonis/Lucid/Orm';
import driveConfig from 'Config/drive';
import { createHash } from 'node:crypto';
import { parse } from 'opentype.js';
import Model from './Model';

export default class FontFile extends Model {
  @column()
  public fontId: number;

  @column()
  public family: string;

  @column()
  public familyZh: string | null;

  @column()
  public subFamily: string;

  @column()
  public subFamilyZh: string | null;

  @column()
  public version: string;

  @column({ consume: (value) => JSON.parse(value), prepare: (value) => JSON.stringify(value) })
  public fvar: any;

  @column()
  public filename: string;

  @column()
  public size: number;

  @column()
  public md5: string;

  @computed()
  public get path(): string {
    return `fonts/${this.id}/${this.filename}`;
  }

  @computed()
  public get url(): string {
    return `${Env.get('SITE_URL')}${driveConfig.disks.local.basePath}/${this.path}`;
  }

  public static parseFont(buffer: Buffer) {
    const size = buffer.byteLength;
    const md5 = createHash('md5').update(buffer).digest('hex');
    const font = parse(buffer.buffer);
    const family = font.names.fontFamily.en;
    const familyZh = font.names.fontFamily.zh;
    const subFamily = font.names.fontSubfamily.en;
    const subFamilyZh = font.names.fontSubfamily.zh;
    const version = font.names.version?.en?.substring(8, font.names.version.en.indexOf(';'));
    const fvar = font.tables.fvar;

    const scripts = font.tables.gsub?.scripts?.map((item: any) => item.tag);

    const path = font.getPath(family + ' ' + subFamily, 0, 0, 24);
    const svg = path.toSVG(3);
    const images = [];

    return { size, md5, family, familyZh, subFamily, subFamilyZh, version, fvar, scripts };
  }
}
