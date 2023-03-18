import schedule from 'node-schedule';
import { IUser, User as UserModel } from '../models/User';
import { autoClosing } from '../services/post';
import { Post as PostModel } from '../models/Post';
import { Notification as NotificationModel } from '../models/Notification';
/*
  글에 관련된 Schedule을 정의한다.
*/

// 자동 마감
async function automaticClosingOfPosts() {
  // 프로덕션 환경에서만 실행
  if (process.env.NODE_ENV === 'production') {
    const rule = new schedule.RecurrenceRule();
    rule.hour = 0;
    rule.tz = 'Asia/Seoul';

    const job = await schedule.scheduleJob(rule, async function () {
      await autoClosing();
    });
  }
}

export { automaticClosingOfPosts };
