import { Types } from 'mongoose';
import CustomError from '../CustomError';
import { IAdvertisementModel } from '../models/Advertisement';
import { IEventDocument, IEventModel } from '../models/Event';
import { timeForEndDate } from '../utills/timeForEndDate';
import { isNumber } from './../utills/isNumber';
import AWS from 'aws-sdk';
import config from '../config';
import { LikeEvents } from '../models/LikeEvents';

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
    onOffLine: string | null
  ) {
    let result: IEventDocument[] = await this.eventModel.findEventPagination(page, sort, eventType, search, onOffLine);
    return result;
  }

  // Pagination을 위해 마지막 페이지를 구한다.
  async findEventLastPage(eventType: string | null, search: string | null, onOffLine: string | null) {
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
    search: string | null
  ) {
    if (!isNumber(year) || !isNumber(month))
      throw new CustomError('IllegalArgumentError', 400, 'Date format is incorrect');
    let b: String = '123';
    let result: IEventDocument[] = await this.eventModel.findEventCalendar(
      Number(year),
      Number(month),
      eventType,
      search
    );
    return result;
  }

  // 메인 화면에서 글 리스트를 조회한다.
  async findEvent(eventId: Types.ObjectId) {
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
      if (!event.isAd || event.isAd !== true) event.isAd = false;

      event.badge = [];
      if (event.endDate > today) {
        event.badge.push({
          type: 'deadline',
          name: `${timeForEndDate(event.endDate)}`,
        });
      }
      return event;
    });
    return result;
  }

  // 글 상세에서 추천 이벤트 조회
  async findRecommendEventListInDetail(eventId: Types.ObjectId, eventType: string | null) {
    const event = await this.eventModel.findRandomEventByEventType(eventId, eventType);
    return event;
  }

  // 공모전 등록
  async createEvent(event: IEventDocument) {
    // TODO 사용자 정보 기입
    //event.author = userID;
    let image = event.imageUrl;
    event.smallImageUrl = image.replace('event-original', 'event-thumbnail'); // 이미지 등록 시 Lambda에서 thumbnail 이미지 생성
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

  // S3 Pre-Sign Url을 발급한다.
  async getPreSignUrl(fileName: string) {
    if (!fileName) {
      throw new CustomError('NotFoundError', 404, '"fileName" does not exist');
    }

    const s3 = new AWS.S3({
      accessKeyId: config.S3AccessKeyId,
      secretAccessKey: config.S3SecretAccessKey,
      region: config.S3BucketRegion,
    });

    const params = {
      Bucket: config.S3BucketName,
      Key: `event-original/${fileName}`,
      Expires: 60 * 10, // seconds
    };

    const signedUrlPut = await s3.getSignedUrlPromise('putObject', params);
    return signedUrlPut;
  }

  // 관심 등록 추가
  async addLike(postId: Types.ObjectId, userId: Types.ObjectId) {
    const { event, isLikeExist } = await this.eventModel.addLike(postId, userId);
    if (!isLikeExist) {
      await LikeEvents.add(postId, userId);
    }
    return event;
  }

  // 관심 등록 취소(삭제)
  async deleteLike(postId: Types.ObjectId, userId: Types.ObjectId) {
    const { event, isLikeExist } = await this.eventModel.deleteLike(postId, userId);
    if (isLikeExist) {
      await LikeEvents.delete(postId, userId);
    }
    return event;
  }
}
