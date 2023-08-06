import { BaseCommand } from '@adonisjs/core/build/standalone';
import Drive from '@ioc:Adonis/Core/Drive';
import Font from 'App/Models/Font';
import FontFile from 'App/Models/FontFile';
import axios from 'axios';
import download from 'download';
import { basename } from 'node:path';

export default class FontGoogle extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'font:google';

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Fetch Google Fonts';

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  };

  public async run() {
    const res = await axios.get('https://fonts.google.com/metadata/fonts');

    for (let i = 0; i < res.data.familyMetadataList.length; i++) {
      const meta = res.data.familyMetadataList[i];

      const res2 = await axios.get(`https://fonts.google.com/metadata/fonts/${meta.family}`);
      const meta2 = JSON.parse(res2.data.substring(4)); //

      const res3 = await axios.get(`https://fonts.google.com/download/list?family=${meta.family}`);
      const meta3 = JSON.parse(res3.data.substring(4));

      this.logger.info('Creating Font model...', meta.family);

      const font = await Font.firstOrCreate({
        family: meta.family,
        source: 'google_fonts',
      });

      if (font.$isLocal) {
        this.logger.success('Font model created!', meta.family);
      } else {
        this.logger.info('Font model exists. Skipped.', meta.family);
      }

      // update license
      switch (meta2?.license) {
        case 'ofl':
          font.license = 'OFL-1.1';
          font.licenseUrl = 'https://scripts.sil.org/OFL';
          break;
        case 'apache2':
          font.license = 'Apache-2.0';
          font.licenseUrl = 'https://www.apache.org/licenses/LICENSE-2.0';
          break;
        case 'ufl':
          font.license = 'UFL-1.0';
          font.licenseUrl = 'https://ubuntu.com/legal/font-licence';
          break;
        default:
          this.logger.error(`Unknown license: ${meta2.license}`);
          throw new Error(`Unknown license: ${meta2.license}`);
      }

      // update source url
      font.sourceUrl = `https://fonts.google.com/specimen/${meta.family.replaceAll(' ', '+')}`;

      // download font files
      const filenames = new Set<string>();
      for (const fileRef of meta3.manifest.fileRefs) {
        const filename = basename(fileRef.filename);
        if (filenames.has(filename)) {
          this.logger.error(`Duplicate filename: ${filename}`);
          throw new Error(`Duplicate filename: ${filename}`);
        } else {
          filenames.add(filename);
        }
        this.logger.info(`Downloading ${filename}`, meta.family);

        const buffer = await download(fileRef.url);
        const attr = await FontFile.parseFont(buffer);

        const file = await FontFile.firstOrCreate({ fontId: font.id, filename }, attr);

        if (!file.$isLocal) {
          file.merge(attr);
        }

        Drive.put(file.path, buffer);
      }
      await font.save();
    }
  }
}
