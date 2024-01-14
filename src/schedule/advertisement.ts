import schedule from 'node-schedule';
import { AdvertisementService, PostService } from '../services/index';
import { Advertisement as AdvertisementModel } from '../models/Advertisement';

/*
  공모전에 관련된 Schedule을 정의한다.
*/

// 자동 마감
async function adAutoClosing() {
  // 프로덕션 환경에서만 실행
  if (process.env.NODE_ENV === 'production') {
    const rule = new schedule.RecurrenceRule();
    rule.hour = 0;
    rule.tz = 'Asia/Seoul';

    const job = await schedule.scheduleJob(rule, async function () {
      const AdvertisementServiceInstance = new AdvertisementService(AdvertisementModel);
      AdvertisementServiceInstance.updateClosedAfterEndDate();
      console.log('updateClosedAfterEndDate!!');
    });
  }
}

export { adAutoClosing };
