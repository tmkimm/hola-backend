import schedule from 'node-schedule';
import { Notification as NotificationModel } from '../models/Notification';
import { EventService, PostService } from '../services/index';
import { Advertisement as AdvertisementModel } from '../models/Advertisement';
import { Event as EventModel } from '../models/Event';
/*
  글에 관련된 Schedule을 정의한다.
*/

// 자동 마감
async function eventAutoClosing() {
  // 프로덕션 환경에서만 실행
  if (process.env.NODE_ENV === 'production') {
    const rule = new schedule.RecurrenceRule();
    rule.hour = 0;
    rule.tz = 'Asia/Seoul';

    const job = await schedule.scheduleJob(rule, async function () {
      const EventServiceInstance = new EventService(EventModel, AdvertisementModel);
      await EventServiceInstance.updateClosedAfterEndDate();
    });
  }
}

export { eventAutoClosing };
