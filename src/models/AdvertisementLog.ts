import { Model, Schema, Types, model } from 'mongoose';

// #region Swagger schema - Advertisement

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
  // findAdvertisement: (id: Types.ObjectId) => Promise<IAdvertisementDocument>;
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

const AdvertisementLog = model<IAdvertisementLogDocument, IAdvertisementLogModel>(
  'AdvertisementLog',
  advertisementLogSchema
);
export { AdvertisementLog };
