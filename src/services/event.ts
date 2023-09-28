import { isNumber } from './../utills/isNumber';
import { Types } from 'mongoose';
import { IEventDocument, IEventModel } from '../models/Event';
import CustomError from '../CustomError';

export class EventService {
  constructor(
    protected eventModel: IEventModel
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
    const events = await this.eventModel.findRecommendEventList();
    return events;
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
