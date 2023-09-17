import { Model, Schema, model, Types } from 'mongoose';

// #region Swagger schema - Event

/**
 * @swagger
 *  components:
 *  schemas:
 *   Event:
 *     properties:
 *      _id:
 *        type: string
 *        description: 공모전 ID
 *        example: '611dbf22739c10ccdbffad39'
 *      title:
 *        type: string
 *        description: '제목'
 *        example: '인프콘 2023'
 *      content:
 *        type: string
 *        description: '내용'
 *        example: '<h1>인프콘 2023 개최!</h1>'
 *      eventType:
 *        type: string
 *        description: '공모전 구분(conference, hackathon, contest, bootcamp, others)'
 *        example: 'conference'
 *      onlineOrOffline:
 *        type: string
 *        description: 이름
 *        example: 'on'
 *      place:
 *        type: string
 *        description: 장소
 *        example: '삼성동 COEX 그랜드홀룸 2F'
 *      organization:
 *        type: string
 *        description: 주최자명
 *        example: '인프런'
 *      link:
 *        type: string
 *        description: 원문 링크
 *        example: 'https://www.inflearn.com/conf/infcon-2023?gad=1&gclid=Cj0KCQjwx5qoBhDyARIsAPbMagAH6o1ODZN3niCQfLRl4NzHuxr0iTgE5RABaJ2yIWZG2m2w5lx7dxIaAnYPEALw_wcB'
 *      imageUrl:
 *        type: string
 *        description: '이미지 URL'
 *        example: 'https://hola-post-image.s3.ap-northeast-2.amazonaws.com/Tony%20Lee_2023-02-22_15-31-09.png'
 *      smallImageUrl:
 *        type: string
 *        description: '이미지 URL(모바일용)'
 *        example: 'https://hola-post-image.s3.ap-northeast-2.amazonaws.com/Tony%20Lee_2023-02-22_15-31-09.png'
 *      startDate:
 *        type: string
 *        description: 시작일
 *        format: date-time
 *        example: "2023-08-15T08:30:00Z"
 *      endDate:
 *        type: string
 *        description: 종료일
 *        format: date-time
 *        example: "2023-08-15T08:30:00Z"
 *      closeDate:
 *        type: string
 *        description: 모집 마감일
 *        format: date-time
 *        example: "2023-08-01T08:30:00Z"
 *      author:
 *        type: string
 *        description: 작성자 ID
 *        example: '63574b3b37ad67001411ba50'
 *      isDeleted:
 *        type: boolean
 *        description: 삭제 여부
 *        example: false
 *      isClosed:
 *        type: boolean
 *        description: 마감 여부
 *        example: false
 *      views:
 *        type: number
 *        description: 조회수
 *        example: 497
 *      totalLikes:
 *        type: number
 *        description: 관심 등록 수
 *        example: false
 *      description:
 *        type: string
 *        description: 공모전 설명
 *        example: '인프콘 2023'
 */
// #endregion

export interface IEvent {
  _id: Types.ObjectId;
  title: string;
  content: string;
  place: string;
  organization: string;
  link: string;
  onlineOrOffline: string;
  imageUrl: string;
  smallImageUrl: string;
  isDeleted: boolean;
  isClosed: boolean;
  startDate: Date;
  endDate: Date;
  closeDate: Date;
  author: Types.ObjectId | null;
  view: number;
  totalLikes: number;
  description: boolean | null;
  isFree: boolean;
  price: number;
}

export interface IEventDocument extends IEvent, Document {
}

export interface IEventModel extends Model<IEventDocument> {
  deleteEvent: (id: Types.ObjectId) => void;
  modifyEvent: (id: Types.ObjectId, event: IEventDocument) => Promise<IEventDocument>;
}

const eventSchema = new Schema<IEventDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true }, // 내용
    eventType: { type: String, required: true }, // 공모전 구분(conference, hackathon, contest, bootcamp, others)
    onlineOrOffline: { type: String, required: true }, // 진행방식(온라인/오프라인)
    place: { type: String, required: true }, // 장소,
    organization: { type: String, required: true }, // 주최자명
    link: { type: String, required: true }, // 원문 링크
    imageUrl: { type: String, required: true }, // 이미지 URL
    smallImageUrl: { type: String, required: true }, // 이미지 URL(Small)
    startDate: { type: Date, required: true }, //  시작일
    endDate: { type: Date, required: true }, //  종료일 
    closeDate: { type: Date, required: true }, //  모집 마감일(자동 마감용도)
    author: { type: Types.ObjectId, ref: 'User', required: false }, // 작성자
    isDeleted: { type: Boolean, default: false }, // 삭제 여부
    isClosed: { type: Boolean, default: false }, // 마감 여부
    views: { type: Number, default: 0 }, // 조회수
    totalLikes: { type: Number, default: 0 }, // 관심 등록 수
    description: { type: String, default: null }, // 공모전 설명
    isFree: { type: Boolean, default: false }, // 무료 여부
    price: { type: Number, default: null }, // 금액
  },
  {
    timestamps: true,
  },
);

eventSchema.statics.modifyEvent = async function (id, event) {
  const eventRecord = await this.findByIdAndUpdate(id, event, {
    new: true,
  });
  return eventRecord;
};

const Event = model<IEventDocument, IEventModel>('Event', eventSchema);
export { Event };
