import { BaseCommand } from '@adonisjs/core/build/standalone';
import Font from 'App/Models/Font';
import axios from 'axios';

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
      const download = JSON.parse(res3.data.substring(4));

      console.log(download);

      this.logger.info('create font model', meta.family);
      const font = await Font.firstOrCreate({
        family: meta.family,
        source: 'google_fonts',
      });
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
        default:
          console.log(meta2.license);
          throw 'unknown license';
      }
      // update source url
      font.sourceUrl = `https://fonts.google.com/specimen/${meta.family.replaceAll(' ', '+')}`;
      await font.save();
    }
  }
}
