import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import CustomError from '../../CustomError';

// 글 id가 존재하는지 확인한다.
export const isObjectIdValid = asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const objectId = req.params.id;
  if (!Types.ObjectId.isValid(objectId)) throw new CustomError('NotFoundError', 404, 'Post not found');
  next();
});
