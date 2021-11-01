import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { User } from '../../models/User';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import CustomError from '../../CustomError';

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
