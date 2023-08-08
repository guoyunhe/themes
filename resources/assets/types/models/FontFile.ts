import FontLang from './FontLang';
import Model from './Model';

export default interface FontFile extends Model {
  family: string;
  familyZh: string;
  subFamily: string;
  subFamilyZh: string;
  langs: FontLang[];
}
