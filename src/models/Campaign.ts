import { Model, Schema, Types, model } from 'mongoose';
import { isNumber } from '../utills/isNumber';

// #region Swagger schema - Campaign

/**
 * @swagger
 *  components:
 *  schemas:
 *   Campaign:
 *     properties:
 *      _id:
 *        type: string
 *        description: 캠페인 ID
 *        example: '611dbf22739c10ccdbffad39'
 *      title:
 *        type: string
 *        description: '캠페인 명'
 *        example: 'Hola 공모전 광고'
 *      companyName:
 *        type: string
 *        description: '광고주 명'
 *        example: 'Holaworld'
 *      managerName:
 *        type: string
 *        description: '담당자 명'
 *        example: '김홍길동'
 *      managerEmail:
 *        type: string
 *        description: '담당자 이메일'
 *        example: 'abc@gmail.com'
 *      managerPhone:
 *        type: string
 *        description: '담당자 휴대폰'
 *        example: '010-1234-5678'
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
 *      basicAdvertisingFee:
 *        type: number
 *        description: 기본 광고비
 *        example: 20000000
 *      conversionType:
 *        type: string
 *        description: 광고 유형(conversion 전환형, view 노출형)
 *        example: 'view'
 *      conversionCost:
 *        type: number
 *        description: '전환당 단가'
 *        example: 15
 *      campaignStatus:
 *        type: string
 *        description: '캠페인 상태(before 진행전, active 진행중, close종료)'
 *        example: 'active'
 *      expectedImpressions:
 *        type: number
 *        description: 예상노출수
 *        example: 56000
 *      remark:
 *        type: string
 *        description: '비고'
 *        example: '비비고 만두'
 */
// #endregion

export interface ICampaign {
  _id: Types.ObjectId;
  companyName: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  startDate: Date;
  endDate: Date;
  basicAdvertisingFee: number;
  conversionType: string;
  conversionCost: number;
  campaignStatus: string;
  expectedImpressions: number;
  remark: string;
}

export interface ICampaignDocument extends ICampaign, Document {}

export interface ICampaignModel extends Model<ICampaignDocument> {
  findCampaign: (id: Types.ObjectId) => Promise<ICampaignDocument>;
  findCampaignListInPagination: (page: string | null) => Promise<ICampaignDocument[]>;
  deleteCampaign: (id: Types.ObjectId) => void;
  modifyCampaign: (id: Types.ObjectId, campaign: ICampaignDocument) => Promise<ICampaignDocument[]>;
}

const campaignSchema = new Schema<ICampaignDocument>(
  {
    title: { type: String, required: true }, // 캠페인명
    companyName: { type: String, required: true }, // 회사명
    managerName: { type: String, required: false }, // 담당자명
    managerEmail: { type: String, required: false }, // 담당자 메일
    managerPhone: { type: String, required: false }, // 담당자 핸드폰 번호
    startDate: { type: Date, required: true }, //  시작일
    endDate: { type: Date, required: false }, //  종료일
    basicAdvertisingFee: { type: Number, default: 0 }, // 기본광고비
    conversionType: { type: String, required: true }, // 광고유형(conversion 전환형, view 노출형)
    conversionCost: { type: Number, default: 0 }, // 전환당 단가
    campaignStatus: { type: String, default: 'before' }, // 상태(before 진행전, active 진행중, close종료)
    expectedImpressions: { type: Number, default: 0 }, // 예상노출수
    remark: { type: String, required: false }, // 비고
  },
  {
    timestamps: true,
  }
);

campaignSchema.statics.findCampaign = async function (id) {
  const campaign = await this.findById(id);
  return campaign;
};

// 캠페인 목록 조회
campaignSchema.statics.findCampaignListInPagination = async function (page: string | null) {
  // Pagenation
  const itemsPerPage = 4 * 5; // 한 페이지에 표현할 수
  let pageToSkip = 0;
  if (isNumber(page) && Number(page) > 0) pageToSkip = (Number(page) - 1) * itemsPerPage;
  const result = await this.find().sort('-createdAt').skip(pageToSkip).limit(Number(itemsPerPage));
  return result;
};

campaignSchema.statics.modifyCampaign = async function (id, campaign) {
  const campaignRecord = await this.findByIdAndUpdate(id, campaign, {
    new: true,
  });
  return campaignRecord;
};

campaignSchema.statics.deleteCampaign = async function (id) {
  await this.findByIdAndDelete(id);
};

const Campaign = model<ICampaignDocument, ICampaignModel>('Campaign', campaignSchema);
export { Campaign };
