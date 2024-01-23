import { Model, Schema, Types, model } from 'mongoose';
import { isNumber } from '../utills/isNumber';

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
 *        description: 온오프라인 구분(on, off, onOff)
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
 *        example: 'https://hola-post-image.s3.ap-northeast-2.amazonaws.com/event-original/20221230_164934.jpg'
 *      smallImageUrl:
 *        type: string
 *        description: '이미지 URL(모바일용)'
 *        example: 'https://hola-post-image.s3.ap-northeast-2.amazonaws.com/event-thumbnail/20221230_164934.jpg'
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
 *      applicationStartDate:
 *        type: string
 *        description: 신청시작일
 *        format: date-time
 *        example: "2023-08-15T08:30:00Z"
 *      applicationEndDate:
 *        type: string
 *        description: 신청종료일
 *        format: date-time
 *        example: "2023-08-15T08:30:00Z"
 *      closeDate:
 *        type: string
 *        description: 모집 마감일
 *        format: date-time
 *        example: "2023-08-01T08:30:00Z"
 *      likes:
 *        type: array
 *        description: 관심 등록한 사용자 리스트
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

/**
 * @swagger
 *  components:
 *  schemas:
 *   RecommendedEvent:
 *     properties:
 *      _id:
 *        type: string
 *        description: 공모전 ID
 *        example: '611dbf22739c10ccdbffad39'
 *      title:
 *        type: string
 *        description: '제목'
 *        example: '인프콘 2023'
 *      eventType:
 *        type: string
 *        description: '공모전 구분(conference, hackathon, contest, bootcamp, others)'
 *        example: 'conference'
 *      imageUrl:
 *        type: string
 *        description: '이미지 URL'
 *        example: 'https://hola-post-image.s3.ap-northeast-2.amazonaws.com/event-original/20221230_164934.jpg'
 *      smallImageUrl:
 *        type: string
 *        description: '이미지 URL(모바일용)'
 *        example: 'https://hola-post-image.s3.ap-northeast-2.amazonaws.com/event-thumbnail/20221230_164934.jpg'
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
 *      views:
 *        type: number
 *        description: 조회수
 *        example: 497
 *      isAD:
 *        type: boolean
 *        description: 광고 여부
 *        example: false
 *      badge:
 *        properties:
 *          type:
 *            type: string
 *            description: 뱃지종류
 *            example: 'deadline'
 *          name:
 *            type: string
 *            description: 뱃지명
 *            example: '마감 3일전'
 */
// #endregion

/**
 * @swagger
 *  components:
 *  schemas:
 *   PostEvent:
 *     properties:
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
 *        description: 온오프라인 구분(on, off, onOff)
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
 *        example: 'https://hola-post-image.s3.ap-northeast-2.amazonaws.com/event-thumbnail/20221230_164934.jpg'
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
 *      applicationStartDate:
 *        type: string
 *        description: 신청시작일
 *        format: date-time
 *        example: "2023-08-15T08:30:00Z"
 *      applicationEndDate:
 *        type: string
 *        description: 신청종료일
 *        format: date-time
 *        example: "2023-08-15T08:30:00Z"
 *      closeDate:
 *        type: string
 *        description: 모집 마감일
 *        format: date-time
 *        example: "2023-08-01T08:30:00Z"
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
  applicationStartDate: Date;
  applicationEndDate: Date;
  closeDate: Date;
  author: Types.ObjectId | null;
  views: number;
  description: boolean | null;
  isFree: boolean;
  price: number;
  likes: Types.ObjectId[]; // 관심 등록한 사용자 리스트
  totalLikes: number;
}

export interface IEventDocument extends IEvent, Document {}

export interface IEventModel extends Model<IEventDocument> {
  deleteEvent: (id: Types.ObjectId) => void;
  modifyEvent: (id: Types.ObjectId, event: IEventDocument) => Promise<IEventDocument[]>;
  findEventPagination: (
    page: string | null,
    sort: string | null,
    eventType: string | null,
    search: string | null,
    onOffLine: string | null
  ) => Promise<IEventDocument[]>;
  findEventCalendar: (
    year: number,
    month: number,
    eventType: string | null,
    search: string | null,
    onOffLine: string | null
  ) => Promise<IEventDocument[]>;
  findEventForSelectBox: (limit: number) => Promise<IEventDocument[]>;
  countEvent: (eventType: string | null, onOffLine: string | null, search: string | null) => Promise<number>;
  findRecommendEventList: (notInEventId: Types.ObjectId[]) => Promise<IEventDocument[]>;
  findRandomEventByEventType: (eventId: Types.ObjectId, eventType: string | null) => Promise<IEventDocument[]>;
  increaseView: (eventId: Types.ObjectId) => void;
  addLike: (
    eventId: Types.ObjectId,
    userId: Types.ObjectId
  ) => Promise<{ event: IEventDocument; isLikeExist: boolean }>;
  deleteLike: (
    eventId: Types.ObjectId,
    userId: Types.ObjectId
  ) => Promise<{ event: IEventDocument; isLikeExist: boolean }>;
  updateClosedAfterEndDate(): void;
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
    applicationStartDate: { type: Date, required: true }, //  신청시작일
    applicationEndDate: { type: Date, required: true }, //  신청종료일
    closeDate: { type: Date, required: false }, //  모집 마감일(자동 마감용도)
    author: { type: Types.ObjectId, ref: 'User', required: false }, // 작성자
    isDeleted: { type: Boolean, default: false }, // 삭제 여부
    isClosed: { type: Boolean, default: false }, // 마감 여부
    views: { type: Number, default: 0 }, // 조회수
    totalLikes: { type: Number, default: 0 }, // 관심 등록 수
    likes: [{ type: Types.ObjectId, ref: 'User' }], // 관심 등록한 사용자 리스트
    description: { type: String, default: null }, // 공모전 설명
    isFree: { type: Boolean, default: false }, // 무료 여부
    price: { type: Number, default: null }, // 금액
  },
  {
    timestamps: true,
  }
);

eventSchema.statics.modifyEvent = async function (id, event) {
  const eventRecord = await this.findByIdAndUpdate(id, event, {
    new: true,
  });
  return eventRecord;
};

eventSchema.statics.deleteEvent = async function (id) {
  await this.findOneAndUpdate({ _id: id }, { isDeleted: true });
};

// 조회 query 생성
// eventType : 공모전 구분(conference, hackathon, contest, bootcamp, others)
// onOffLine : 진행방식(온라인/오프라인)
// isClosed  : 마감여부(null : 전체 조회, false : 마감되지 않은 자료만 조회, true : 마감된 자료만 조회)
const makeFindEventQuery = (eventType: string | null, onOffLine: string | null, isClosed: boolean | null) => {
  // Query
  const query: any = {};

  if (typeof onOffLine === 'string' && onOffLine && onOffLine != 'ALL') query.onlineOrOffline = onOffLine;

  if (isClosed != null) query.isClosed = { $eq: isClosed };
  query.isDeleted = { $eq: false };

  // 공모전 구분(conference, hackathon, contest, bootcamp, others)
  if (typeof eventType === 'string' && eventType && eventType != 'ALL') {
    query.eventType = { $eq: eventType };
  }
  return query;
};

// 최신, 트레딩 조회
eventSchema.statics.findEventPagination = async function (
  page: string | null,
  sort: string | null,
  eventType: string | null,
  search: string | null,
  onOffLine: string | null
) {
  let sortQuery = [];
  // Sorting
  if (sort) {
    const sortableColumns = ['views', 'createdAt'];
    sortQuery = sort.split(',').filter((value: string) => {
      return sortableColumns.indexOf(value.substr(1, value.length)) !== -1 || sortableColumns.indexOf(value) !== -1;
    });
    sortQuery.push('-createdAt');
  } else {
    sortQuery.push('-createdAt');
  }
  const query = makeFindEventQuery(eventType, onOffLine, null); // 조회 query 생성
  // Pagenation
  const itemsPerPage = 4 * 5; // 한 페이지에 표현할 수
  let pageToSkip = 0;
  if (isNumber(page) && Number(page) > 0) pageToSkip = (Number(page) - 1) * itemsPerPage;
  const aggregateSearch = [];
  if (search && typeof search === 'string') {
    aggregateSearch.push({
      $search: {
        index: 'events_text_search',
        text: {
          query: search,
          path: {
            wildcard: '*',
          },
        },
      },
    });
  }
  const aggregate = [...aggregateSearch, { $match: query }];

  const events = await this.aggregate(aggregate).sort(sortQuery.join(' ')).skip(pageToSkip).limit(Number(itemsPerPage));
  return events;
};

// 공모전 캘린더뷰 조회
eventSchema.statics.findEventCalendar = async function (
  year: number,
  month: number,
  eventType: string | null,
  search: string | null,
  onOffLine: string | null
) {
  const query = makeFindEventQuery(eventType, onOffLine, null); // 조회 query 생성
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month);
  query.startDate = { $gte: firstDay, $lte: lastDay };
  const aggregateSearch = [];
  if (search && typeof search === 'string') {
    aggregateSearch.push({
      $search: {
        index: 'events_text_search',
        text: {
          query: search,
          path: {
            wildcard: '*',
          },
        },
      },
    });
  }
  const aggregate = [...aggregateSearch, { $match: query }];

  const events = await this.aggregate(aggregate).sort('startDate');
  return events;
};

// 총 Page 수 계산
eventSchema.statics.countEvent = async function (eventType, onOffLine, search) {
  const query = makeFindEventQuery(eventType, onOffLine, null); // 조회 query 생성
  const aggregateSearch = [];
  if (search && typeof search === 'string') {
    aggregateSearch.push({
      $search: {
        index: 'events_text_search',
        text: {
          query: search,
          path: {
            wildcard: '*',
          },
        },
      },
    });
  }

  const aggregate: any = [
    ...aggregateSearch,
    { $match: query },
    {
      $project: {
        title: 1,
        score: { $meta: 'searchScore' },
      },
    },
  ];
  aggregate.push({
    $count: 'eventCount',
  });

  const result: any = await this.aggregate(aggregate);
  if (result && result.length > 0) return result[0].eventCount;
  else return 0;
};

// 조회수 증가
eventSchema.statics.increaseView = async function (eventId) {
  await this.findByIdAndUpdate(eventId, {
    $inc: {
      views: 1,
    },
  });
};

// 이벤트 목록 select box
eventSchema.statics.findEventForSelectBox = async function (limit: number) {
  const query = makeFindEventQuery(null, null, false); // 조회 query 생성
  const events = await this.find(query).select('_id title').sort('-createdAt').limit(limit);
  return events;
};

// 추천 이벤트 조회
// TODO startDate 조건 변경
eventSchema.statics.findRecommendEventList = async function (notInEventId: Types.ObjectId[]) {
  let query = makeFindEventQuery(null, null, false); // 조회 query 생성
  query._id = { $nin: notInEventId };
  let limit = 10 - notInEventId.length;
  const today = new Date();
  query.startDate = { $gte: today.setDate(today.getDate() - 180) };
  const events = await this.find(query)
    .select('_id title eventType imageUrl smallImageUrl startDate endDate views')
    .sort('-views')
    .limit(limit)
    .lean();
  return events;
};

// 랜덤 이벤트 조회(글 상세에서 추천)
eventSchema.statics.findRandomEventByEventType = async function (eventId: Types.ObjectId, eventType: string | null) {
  const query = makeFindEventQuery(eventType, null, false); // 조회 query 생성
  query._id = { $ne: eventId }; // 현재 읽고 있는 글 제외
  // TODO 기간 조건 추가
  const event = await this.aggregate([{ $match: query }, { $sample: { size: 6 } }]);
  return event;
};

// 관심등록 추가
// 디바운스 실패 경우를 위해 예외처리
eventSchema.statics.addLike = async function (eventId, userId) {
  const event: IEvent[] = await this.find({ _id: eventId, likes: { $in: [userId] } });
  const isLikeExist = event.length > 0;
  let result: IEvent;

  if (!isLikeExist) {
    result = await this.findByIdAndUpdate(
      { _id: eventId },
      {
        $push: {
          likes: {
            _id: userId,
          },
        },
        $inc: {
          totalLikes: 1,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );
  } else {
    result = event[event.length - 1];
  }
  return { event: result, isLikeExist };
};

eventSchema.statics.deleteLike = async function (eventId, userId) {
  const events = await this.find({ _id: eventId });
  let event: IEvent | null = events[events.length - 1];
  const isLikeExist = event && event.likes.indexOf(userId) > -1;
  if (isLikeExist) {
    event = await this.findOneAndUpdate(
      { _id: eventId },
      {
        $pull: { likes: userId },
        $inc: {
          totalLikes: -1,
        },
      },
      {
        new: true,
      }
    );
  }
  return { event, isLikeExist };
};

// 신청기간이 지난글 자동 마감
eventSchema.statics.updateClosedAfterEndDate = async function () {
  const today = new Date();
  await this.updateMany({ $and: [{ isClosed: false }, { applicationEndDate: { $lte: today } }] }, { isClosed: true });
};
const Event = model<IEventDocument, IEventModel>('Event', eventSchema);
export { Event };
