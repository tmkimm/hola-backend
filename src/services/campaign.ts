import { Types } from 'mongoose';
import CustomError from '../CustomError';
import { IAdvertisementModel } from '../models/Advertisement';
import { ICampaignDocument, ICampaignModel } from '../models/Campaign';
import { IAdvertisementLogModel } from '../models/AdvertisementLog';

export class CampaignService {
  constructor(
    protected campaignModel: ICampaignModel,
    protected advertisementModel: IAdvertisementModel,
    protected advertisementLogModel: IAdvertisementLogModel
  ) {}

  // 캠페인 리스트 조회
  async findCampaignList(page: string | null) {
    let result: ICampaignDocument[] = await this.campaignModel.findCampaignListInPagination(page);
    return result;
  }

  // 캠페인 상세 조회
  async findCampaign(campaignId: Types.ObjectId) {
    const campaign = await this.campaignModel.findCampaign(campaignId);
    if (!campaign) throw new CustomError('NotFoundError', 404, 'Campaign not found');
    return campaign;
  }

  // 캠페인 등록
  async createCampaign(campaign: ICampaignDocument) {
    const campaignRecord = await this.campaignModel.create(campaign);
    return campaignRecord;
  }

  // 캠페인 수정
  async modifyCampaign(id: Types.ObjectId, campaign: ICampaignDocument) {
    const campaignRecord = await this.campaignModel.modifyCampaign(id, campaign);
    return campaignRecord;
  }

  // 캠페인 삭제
  async deleteCampaign(id: Types.ObjectId) {
    await this.campaignModel.deleteCampaign(id);
  }

  // 캠페인의 광고 리스트 조회
  async findAdvertisementInCampaign(campaignId: Types.ObjectId) {
    return await this.advertisementModel.findAdvertisementInCampaign(campaignId);
  }

  // 광고 결과 집계
  async findCampaignResult(campaignId: Types.ObjectId) {
    const campaign = await this.findCampaign(campaignId);
    const adList = await this.advertisementModel.findAdvertisementInCampaign(campaignId);
    const adIdList = adList.map((ad: any) => {
      return Types.ObjectId(ad._id);
    });
    // 로그 집계
    const aggregate = await this.advertisementLogModel.findADResult(adIdList);
    const logAggregate = aggregate.map((ad: any) => {
      return {
        _id: ad._id.advertisementId,
        logType: ad._id.logType,
        count: ad.count,
        advertisementType: ad.advertisements.advertisementType,
      };
    });
    // 광고 성과 형식으로 그룹핑
    let result: any = [];
    logAggregate.forEach((element: any) => {
      let index = result.findIndex((v: any) => (v.advertisementType === element.advertisementType ? true : false));
      if (index === -1) {
        result.push({
          advertisementType: element.advertisementType,
          advertisementId: element._id,
          [element.logType]: element.count,
        });
      } else {
        result[index] = {
          ...result[index],
          [element.logType]: element.count,
        };
      }
    });

    // 전환비용, 클릭률 세팅
    result = result.map((v: any) => {
      if (!v.reach || !v.impression) return v;
      const reachRate = ((v.reach / v.impression) * 100).toFixed(2) + '%';
      const reachPrice = (campaign.conversionCost * v.reach).toFixed(0);
      return {
        ...v,
        reachRate,
        reachPrice,
      };
    });
    return result;
  }
}
