import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import CustomError from '../../CustomError';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Advertisement, IAdvertisementDocument } from '../../models/Advertisement';

// 공모전 삭제 시 해당 공모전으로 광고가 진행중일 경우 삭제할 수 없다.
const checkADIsActive = asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const eventId = req.params.id;
  const { ObjectId } = mongoose.Types;

  if (!eventId || !ObjectId.isValid(eventId)) throw new CustomError('NotFoundError', 404, 'Event Id is Invalid');
  const ad: IAdvertisementDocument[] = await Advertisement.findAdvertisementByEventId(eventId);
  if (ad && ad.length > 0 && ad[ad.length - 1].advertisementStatus == 'active') {
    throw new CustomError('UnAuthorizedError', 400, 'An active ad exists.');
  }
  next();
});

export { checkADIsActive };
