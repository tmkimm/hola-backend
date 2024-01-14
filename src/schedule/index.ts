import { eventAutoClosing } from './event';
import { postAutoClosing } from './post';
import { adAutoClosing } from './advertisement';

export default () => {
  //postAutoClosing(); // 자동 마감
  eventAutoClosing(); // 공모전 신청 기간이 지나면 자동 마감
  adAutoClosing(); // 광고 진행 기간이 지나면 자동 마감
};
