import schedule from 'node-schedule';
import { IUser, User as UserModel } from '../models/User';
import { PostService } from '../services/index';
import { Post as PostModel } from '../models/Post';
import { Notification as NotificationModel } from '../models/Notification';
/*
  글에 관련된 Schedule을 정의한다.
*/

// 자동 마감
async function autoClosing() {
  const rule = new schedule.RecurrenceRule();
  rule.hour = 0;
  rule.tz = 'Asia/Seoul';

  const job = await schedule.scheduleJob(rule, async function () {
    const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
    await PostServiceInstance.autoClosing();
  });
}

export { autoClosing };
