import Env from '@ioc:Adonis/Core/Env';
import { HasMany, column, computed, hasMany } from '@ioc:Adonis/Lucid/Orm';
import driveConfig from 'Config/drive';
import { createHash } from 'node:crypto';
import { parse } from 'opentype.js';
import FontLang from './FontLang';
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

  @hasMany(() => FontLang)
  public langs: HasMany<typeof FontLang>;

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

    const scripts = font.tables.gsub?.scripts;

    // https://learn.microsoft.com/en-us/typography/opentype/spec/languagetags
    const langs: { lang: string; preview: string }[] = [];
    scripts?.forEach((script: any) => {
      script?.script?.langSysRecords?.forEach((langSys: any) => {
        const lang: any = { lang: langSys.tag.trim() };
        let text = '';
        switch (lang.lang) {
          case 'ZHS':
            text = '人类的赞歌是「勇气」的赞歌！！';
            break;
          case 'ZHT':
            text = '人類的讚歌是勇氣的讚歌！！';
            break;
          case 'JAN':
            text = '人間讃歌は「勇気」の讃歌ッ！！';
            break;
          default: // Latin
            text = 'Human praise is the praise of “bravery”!!';
        }
        const path = font.getPath(text, 0, 18, 18);
        lang.preview = path.toSVG(3);
        langs.push(lang);
      });
    });

    if (!langs.some((item) => item.lang === 'ENG')) {
      const lang: any = { lang: 'ENG' };
      const path = font.getPath('Human praise is the praise of “bravery”!!', 0, 18, 18);
      lang.preview = path.toSVG(3);
      langs.push(lang);
    }

    return { size, md5, family, familyZh, subFamily, subFamilyZh, version, fvar, langs };
  }
}
