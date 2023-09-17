import { Types } from 'mongoose';
import { IEventDocument, IEventModel } from '../models/Event';

export class EventService {
  constructor(
    protected eventModel: IEventModel
  ) {}

  // 공모전 등록
  async createEvent(post: IEventDocument) {
    // TODO 사용자 정보 기입
    //post.author = userID;
    const postRecord = await this.eventModel.create(post);
    return postRecord;
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
      await this.eventModel.findOneAndDelete({ _id: id });
  }
}
