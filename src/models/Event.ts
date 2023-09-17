import { Model, Schema, model, Types } from 'mongoose';
import { signJWT } from '../utills/jwt';
import { Post as PostModel } from './Post';
import { Notification as NotificationModel } from './Notification';

/**
 * @swagger
 *  components:
 *  schemas:
 *   Event:
 *     properties:
 *      _id:
 *        type: string
 *        description: 사용자 ID
 *        example: '611dbf22739c10ccdbffad39'
 *      idToken:
 *        type: string
 *        description: '사용자 토큰(Oauth용)'
 *        example: '1856444309'
 *      tokenType:
 *        type: string
 *        description: '로그인 종류(google, github, kakao, admin)'
 *        example: 'google'
 *      name:
 *        type: string
 *        description: 이름
 *        example: '김올라'
 *      nickName:
 *        type: string
 *        description: 이름
 *        example: 'hola'
 *      password:
 *        type: string
 *        description: 비밀번호(미사용)
 *        example: '1234'
 *      image:
 *        type: string
 *        description: '이미지 명(기본 : default.PNG)'
 *        example: 'default.PNG'
 *      likeLanguages:
 *        type: array
 *        items:
 *          type: string
 *        description: 관심 언어
 *        example:
 *          - react
 *          - java
 */

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
    eventType: { type: String, required: true }, // 이벤트 구분(컨퍼런스, 해커톤, 공모전, 부트캠프)
    place: { type: String, required: true }, // 장소,
    organization: { type: String, required: true }, // 주최자명
    link: { type: String, required: true }, // 원문 링크
    onlineOrOffline: { type: String, required: true }, // 진행방식(온라인/오프라인)
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
    description: { type: String, default: null }, // 이벤트 설명
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
