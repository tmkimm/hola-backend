import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import CustomError from '../../CustomError';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';

// 글 id가 존재하는지 확인한다.
export const isObjectIdValid = asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const objectId = req.params.id;
  if (!Types.ObjectId.isValid(objectId)) throw new CustomError('NotFoundError', 404, 'Post not found');
  next();
});
