import { Model, Schema, Types, model } from 'mongoose';

// #region Swagger schema - AdvertisementResult

/**
 * @swagger
 *  components:
 *  schemas:
 *   AdvertisementResult:
 *     properties:
 *      _id:
 *        type: string
 *        description: 광고 ID
 *        example: '611dbf22739c10ccdbffad39'
 *      advertisementType:
 *        type: string
 *        description: 광고유형(banner 메인 배너, event 공모전, modalBanner 모달 상세 배너)
 *        example: banner
 *      logType:
 *        type: string
 *        description: 로그유형(impression 노출, reach 도달)
 *        example: impression
 *      count:
 *        type: number
 *        description: 결과 수
 *        example: "3572"
 */
// #endregion

// #region Swagger schema - AdvertisementLog

/**
 * @swagger
 *  components:
 *  schemas:
 *   AdvertisementLog:
 *     properties:
 *      _id:
 *        type: string
 *        description: 로그 ID
 *        example: '611dbf22739c10ccdbffad39'
 *      advertisementId:
 *        type: string
 *        description: 광고 ID
 *        example: '611dbf22739c10ccdbffad39'
 *      logType:
 *        type: string
 *        description: 로그유형(impression 노출, reach 도달)
 *        example: impression
 *      logDate:
 *        type: string
 *        description: 로그발생일자
 *        format: date-time
 *        example: "2023-08-15T08:30:00Z"
 */
// #endregion

export interface IAdvertisementLog {
  _id: Types.ObjectId;
  advertisementId: Types.ObjectId;
  logType: string;
  logDate: Date;
}

export interface IAdvertisementLogDocument extends IAdvertisementLog, Document {}

export interface IAdvertisementLogModel extends Model<IAdvertisementLogDocument> {
  findADResult: (advertiesmentId: Types.ObjectId[]) => Promise<any>;
}

const advertisementLogSchema = new Schema<IAdvertisementLogDocument>(
  {
    advertisementId: { type: Types.ObjectId, ref: 'Avertisement', required: true }, // 광고 Id
    logType: { type: String, required: true }, // 로그유형(impression 노출, reach 도달)
    logDate: { type: Date, required: true }, //  로그 생성일
  },
  {
    timestamps: true,
  }
);

// 광고 성과 집계
advertisementLogSchema.statics.findADResult = async function (advertiesmentId: Types.ObjectId[]) {
  const result = await this.aggregate([
    {
      $match: {
        advertisementId: { $in: advertiesmentId },
      },
    },
    {
      $group: {
        _id: {
          advertisementId: '$advertisementId',
          logType: '$logType',
        },
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'advertisements',
        localField: '_id.advertisementId',
        foreignField: '_id',
        pipeline: [{ $project: { advertisementType: 1 } }],
        as: 'advertisements',
      },
    },
    { $unwind: '$advertisements' },
  ]).sort('advertisements.advertisementType _id.logType');
  return result;
};

const AdvertisementLog = model<IAdvertisementLogDocument, IAdvertisementLogModel>(
  'AdvertisementLog',
  advertisementLogSchema
);

export { AdvertisementLog };
