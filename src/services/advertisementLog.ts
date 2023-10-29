import { Types } from 'mongoose';
import CustomError from '../CustomError';
import { IAdvertisementLogDocument, IAdvertisementLogModel } from '../models/AdvertisementLog';

export class AdvertisementLogService {
  constructor(protected advertisementLogModel: IAdvertisementLogModel) {}

  // 광고 상세 조회
  async createEventLog(advertisementId: Types.ObjectId, logType: String) {
    if (!advertisementId) throw new CustomError('NotFoundError', 404, '"advertisementId" not found');
    if (!logType) throw new CustomError('NotFoundError', 404, '"logType" not found');
    if (logType != 'impression' && logType != 'reach')
      throw new CustomError('NotFoundError', 404, '"logType" Invalid Code');

    const advertisement = await this.advertisementLogModel.create({
      advertisementId,
      logType,
      logDate: new Date(),
    });
    return advertisement;
  }
}
