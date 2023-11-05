import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import CustomError from '../../CustomError';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';

// 글 id가 존재하는지 확인한다.
export const isEventIdValid = asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const eventId = req.params.id || req.params.eventId || req.body.eventId || req.query.eventId;
  if (!eventId || !Types.ObjectId.isValid(eventId)) throw new CustomError('NotFoundError', 404, 'Event not found');

  next();
});
