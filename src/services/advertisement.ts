import { Types } from 'mongoose';
import CustomError from '../CustomError';
import { IAdvertisementDocument, IAdvertisementModel } from '../models/Advertisement';

export class AdvertisementService {
  constructor(protected advertisementModel: IAdvertisementModel) {}

  // 진행중인 배너 광고 조회
  async findActiveBanner() {
    const advertisement = await this.advertisementModel.findActiveBanner();
    return advertisement;
  }

  // 광고 상세 조회
  async findAdvertisement(advertisementId: Types.ObjectId) {
    const advertisement: any = await this.advertisementModel.findAdvertisement(advertisementId);
    if (!advertisement) throw new CustomError('NotFoundError', 404, 'Advertisement not found');
    if (
      advertisement.advertisementType === `event` &&
      advertisement.eventId &&
      advertisement.eventId._id &&
      advertisement.eventId.title
    )
      return { ...advertisement, eventId: advertisement.eventId._id, eventTitle: advertisement.eventId.title };
    else return advertisement;
  }

  // 광고 등록
  async createAdvertisement(advertisement: IAdvertisementDocument) {
    const advertisementRecord = await this.advertisementModel.create(advertisement);
    return advertisementRecord;
  }

  // 광고 수정
  async modifyAdvertisement(id: Types.ObjectId, advertisement: IAdvertisementDocument) {
    const advertisementRecord = await this.advertisementModel.modifyAdvertisement(id, advertisement);
    return advertisementRecord;
  }

  // 광고 삭제
  async deleteAdvertisement(id: Types.ObjectId) {
    await this.advertisementModel.deleteAdvertisement(id);
  }
}
