import Comment from './Comment';
import FontFile from './FontFile';
import Like from './Like';
import Model from './Model';
import Tag from './Tag';
import User from './User';

export default interface Font extends Model {
  family: string;
  familyZh: string;
  downloads: number;
  userId: number;
  user: User;
  tags: Tag[];
  comments: Comment[];
  commentsCount: number;
  likesSum: number;
  likes?: Like[];
  files: FontFile[];
}
