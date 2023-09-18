import { Model, Schema, model, Types } from 'mongoose';
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
 *        example: 'https://hola-event-image.s3.ap-northeast-2.amazonaws.com/Tony%20Lee_2023-02-22_15-31-09.png'
 *      smallImageUrl:
 *        type: string
 *        description: '이미지 URL(모바일용)'
 *        example: 'https://hola-event-image.s3.ap-northeast-2.amazonaws.com/Tony%20Lee_2023-02-22_15-31-09.png'
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
  modifyEvent: (id: Types.ObjectId, event: IEventDocument) => Promise<IEventDocument[]>;
  findEventPagination: (page: string | null, sort: string | null, eventType: string | null, search: string | null, onOffLine: string | null) => Promise<IEventDocument[]>;
  countEvent: (eventType: string | null, onOffLine: string | null, search: string | null) => Promise<number>;
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

eventSchema.statics.deleteEvent = async function (id) {
  await this.findOneAndUpdate({ _id: id }, { isDeleted: true });
};

// 조회 query 생성
const makeFindEventQuery = (
  eventType: string | null,
  onOffLine: string | null,
) => {
  // Query
  const query: any = {};

  if (typeof onOffLine === 'string' && onOffLine && onOffLine != 'ALL') query.onlineOrOffline = onOffLine;

  query.isClosed = { $eq: false };
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
  onOffLine: string | null,
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
    sortQuery.push('createdAt');
  }
  const query = makeFindEventQuery(eventType, onOffLine); // 조회 query 생성
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
  const aggregate = [
    ...aggregateSearch,
    { $match: query },
  ];

  if (search && typeof search === 'string') {
    aggregate.push({
      $match : {
        score: {
          $gte: 0.5
        }
      }
    });
  }
  const events = await this.aggregate(aggregate).sort(sortQuery.join(' ')).skip(pageToSkip).limit(Number(itemsPerPage));
  return events;
};

// 총 Page 수 계산
eventSchema.statics.countEvent = async function (eventType, onOffLine, search) {
  const query = makeFindEventQuery(eventType, onOffLine); // 조회 query 생성
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
        score: { $meta: "searchScore" }
      },
    },
  ];
  if (search && typeof search === 'string') {
    aggregate.push({
      $match : {
        score: {
          $gte: 0.5
        }
      }
    });
  }
  aggregate.push({
    $count: "eventCount"
  });

  const result: any = await this.aggregate(aggregate);
  if(result && result.length > 0)
    return result[0].eventCount; 
  else
    return 0;
}  

const Event = model<IEventDocument, IEventModel>('Event', eventSchema);
export { Event };