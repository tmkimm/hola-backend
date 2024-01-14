import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import CustomError from '../../CustomError';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Advertisement, IAdvertisementDocument } from '../../models/Advertisement';

// 광고 등록 시 캠페인에 같은 유형의 광고가 있는지 체크
const checkADTypeDuplication = asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
  if (!('campaignId' in req.body) || !('advertisementType' in req.body)) {
    throw new CustomError('ContentInvaildError', 400, 'ContentInvaildError');
  }

  const campaignId = req.body.campaignId;
  const advertisementType = req.body.advertisementType;
  const { ObjectId } = mongoose.Types;

  if (!ObjectId.isValid(campaignId)) throw new CustomError('NotFoundError', 404, 'Campaign Id is Invalid');

  const ad: IAdvertisementDocument[] = await Advertisement.findAdvertisementByType(campaignId, advertisementType);
  if (ad && ad.length > 0) {
    throw new CustomError('DuplicationADTypeError', 400, 'The campaign advertisement type already exists.');
  }
  next();
});

export { checkADTypeDuplication };
