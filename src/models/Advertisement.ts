import { Model, Schema, model, Types, Number } from 'mongoose';
import { isNumber } from '../utills/isNumber';

// #region Swagger schema - Advertisement

/**
 * @swagger
 *  components:
 *  schemas:
 *   Advertisement:
 *     properties:
 *      _id:
 *        type: string
 *        description: 광고 ID
 *        example: '611dbf22739c10ccdbffad39'
 *      campaignId:
 *        type: string
 *        description: 캠페인 ID
 *        example: '611dbf22739c10ccdbffad39'
 *      advertisementType:
 *        type: string
 *        description: 광고유형(banner 배너, event 공모전)
 *        example: banner
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
 *      realEndDate:
 *        type: string
 *        description: 실제 종료일(종료 처리된 날짜)
 *        format: date-time
 *        example: "2023-08-15T08:30:00Z"
 *      advertisementStatus:
 *        type: string
 *        description: 상태(before 진행전, active 진행중, close종료)
 *        example: 'active'
 *      link:
 *        type: string
 *        description: '링크'
 *        example: 'https://holaworld.io/study/650bc1d5c003f400133ac1ea'
 *      linkOpenType:
 *        type: string
 *        description: 링크 오픈 유형(blank 새탭, self 현재탭)
 *        example: 'blank'
 *      imageUrl:
 *        type: string
 *        description: 이미지 URL(배너광고)
 *        example: 'https://holaworld.io/images/logo/hola_logo_y.png'
 *      mainCopy:
 *        type: string
 *        description: 메인 카피 (배너광고)
 *        example: 'Hola!는 봄맞이 새단장 완료'
 *      subCopy:
 *        type: string
 *        description: '서브 카피(배너광고)'
 *        example: '더 편해진 올라! 모르는 사람 없게 해주세요'
 *      bannerSequence:
 *        type: number
 *        description: '배너 순번(0 ~ 999 자유 지정)'
 *        example: 3
 *      eventId:
 *        type: string
 *        description: 공모전 id(공모전 광고)
 *        example: '611dbf22739c10ccdbffad39'
 */
// #endregion

export interface IAdvertisement {
  _id: Types.ObjectId;
  campaignId: Types.ObjectId;
  advertisementType: string;
  startDate: Date;
  endDate: Date;
  realEndDate: Date;
  advertisementStatus: string;
  link: string;
  linkOpenType: string;
  imageUrl: string;
  mainCopy: string;
  subCopy: string;
  bannerSequence: number;
  eventId: Types.ObjectId;
}

export interface IAdvertisementDocument extends IAdvertisement, Document {
}

export interface IAdvertisementModel extends Model<IAdvertisementDocument> {
  deleteAdvertisement: (id: Types.ObjectId) => void;
  modifyAdvertisement: (id: Types.ObjectId, advertisement: IAdvertisementDocument) => Promise<IAdvertisementDocument[]>;
}


const advertisementSchema = new Schema<IAdvertisementDocument>(
  {
    campaignId: { type: Types.ObjectId, ref: 'Campaign', required: true }, // 캠페인 Id
    advertisementType: { type: String, required: true }, // 광고유형(banner 배너, event 공모전)
    startDate: { type: Date, required: true }, //  시작일
    endDate: { type: Date, required: false }, //  종료일 
    realEndDate: { type: Date, required: false }, //  실제 종료일(종료 처리된 날짜)
    advertisementStatus: { type: String, default: 'before' }, // 상태(before 진행전, active 진행중, close종료)
    link: { type: String, required: true }, // 링크
    linkOpenType: { type: String, defulat: 'blank' }, // 링크 오픈 유형(blank 새탭, self 현재탭)
    imageUrl: { type: String, required: false }, // 이미지 URL(배너광고)
    mainCopy: { type: String, required: false }, // 메인 카피 (배너광고)
    subCopy: { type: String, required: false }, // 서브 카피(배너광고)
    bannerSequence: { type: Number, default: 999 }, // 배너 순번(배너광고)
    eventId: { type: Types.ObjectId, ref: 'Event', required: false }, // 이벤트 Id(공모전 광고)
  },
  {
    timestamps: true,
  },
);

advertisementSchema.statics.modifyAdvertisement = async function (id, advertisement) {
  const advertisementRecord = await this.findByIdAndUpdate(id, advertisement, {
    new: true,
  });
  return advertisementRecord;
};

advertisementSchema.statics.deleteAdvertisement = async function (id) {
  await this.findOneAndDelete(id);
};


const Advertisement = model<IAdvertisementDocument, IAdvertisementModel>('Advertisement', advertisementSchema);
export { Advertisement };
