import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import CustomError from '../../CustomError';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { User } from '../../models/User';

// 사용자 id가 올바른지 확인한다.
const isUserIdValid = asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id || req.body.id || req.query.id;
  const { ObjectId } = mongoose.Types;

  if (!userId || !ObjectId.isValid(userId)) throw new CustomError('NotFoundError', 404, 'User not found');
  const user = await User.findById(userId);
  if (!user) throw new CustomError('NotFoundError', 404, 'User not found');

  next();
});

export { isUserIdValid };
