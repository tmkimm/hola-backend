import { isNumber } from './../utills/isNumber';
import { Types } from 'mongoose';
import { IEventDocument, IEventModel } from '../models/Event';
import CustomError from '../CustomError';
import { IAdvertisementDocument, IAdvertisementModel } from '../models/Advertisement';
import { timeForEndDate } from '../utills/timeForEndDate';

export class EventService {
  constructor(
    protected eventModel: IEventModel,
    protected adverisementModel: IAdvertisementModel
  ) {}

  // 메인 화면에서 글 리스트를 조회한다.
  async findEventList(
    page: string | null,
    sort: string | null,
    eventType: string | null,
    search: string | null,
    onOffLine: string | null,
  ) {
    let result: IEventDocument[] = await this.eventModel.findEventPagination(
      page,
      sort,
      eventType,
      search,
      onOffLine,
    );
    return result;
  }

  
  // Pagination을 위해 마지막 페이지를 구한다.
  async findEventLastPage(
    eventType: string | null,
    search: string | null,
    onOffLine: string | null,
  ) {
    
    const itemsPerPage = 4 * 5; // 한 페이지에 표현할 수
    let count = await this.eventModel.countEvent(eventType, search, onOffLine);
    const lastPage = Math.ceil(count / itemsPerPage);
    return lastPage;
  }

  // 메인 화면에서 글 리스트를 조회한다.
  async findEventListInCalendar(
    year: string | null,
    month: string | null,
    eventType: string | null,
    search: string | null,
  ) {
    if (!isNumber(year) || !isNumber(month)) throw new CustomError('IllegalArgumentError', 400, 'Date format is incorrect'); 

    let result: IEventDocument[] = await this.eventModel.findEventCalendar(
      Number(year),
      Number(month),
      eventType,
      search,
    );
    return result;
  }

  
  // 메인 화면에서 글 리스트를 조회한다.
  async findEvent(
    eventId: Types.ObjectId
  ) {
    const event = await this.eventModel.findById(eventId);
    if (!event) throw new CustomError('NotFoundError', 404, 'Event not found');
    return event;
  }

  // 추천 이벤트
  async findRecommendEventList() {
    // 광고 진행중인 공모전 조회
    const activeADInEvent = await this.adverisementModel.findActiveADListInEvent(); 

    // event 정보만 분리
    const adEventList = activeADInEvent
    .filter((i: any) => {
      return i.event && i.event.length > 0 && i.event[0] !== null && i.event[0] !== undefined;
    })
    .map((i: any) => {
      i.event[0].isAd = true;
      return i.event[0];
    });
    
    // 인기 공모전 조회 시 광고로 조회된 공모전 제외
    const notInEventId = adEventList.map((event: IEventDocument) => {
      return event._id;
     });

    // id를 분리하여 not in으로
    const events = await this.eventModel.findRecommendEventList(notInEventId);
    adEventList.push(...events);

    // 마감임박 뱃지 추가
    const today: Date = new Date();
    const result: any = adEventList.map((event: any) => {
      if(!event.isAd || event.isAd !== true)
        event.isAd = false;

      event.badge = [];
      if (event.endDate > today) {
        event.badge.push(
          {
            type: 'deadline',
            name: `${timeForEndDate(event.endDate)}`,
          },
        );
      }
      return event;
    });
    return result;
  }

  // 공모전 등록
  async createEvent(event: IEventDocument) {
    // TODO 사용자 정보 기입
    //event.author = userID;
    const eventRecord = await this.eventModel.create(event);
    return eventRecord;
  }

  // 공모전 수정
  async modifyEvent(id: Types.ObjectId, event: IEventDocument) {

    // TODO 공모전 권한 관리
    // if (id.toString() !== tokenEventId.toString())
    //   throw new CustomError('NotAuthenticatedError', 401, 'Event does not match');
    const eventRecord = await this.eventModel.modifyEvent(id, event);
    return eventRecord;
  }

  // 공모전 삭제
  async deleteEvent(id: Types.ObjectId) {

    // TODO 공모전 권한 관리
    // if (id.toString() !== tokenEventId.toString())
    //   throw new CustomError('NotAuthenticatedError', 401, 'Event does not match');
      await this.eventModel.deleteEvent(id);
  }
}
