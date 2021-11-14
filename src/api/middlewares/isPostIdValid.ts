import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { Post } from '../../models/Post';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import CustomError from '../../CustomError';

// 글 id가 존재하는지 확인한다.
export const isPostIdValid = asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const postId = req.params.id || req.params.postId || req.body.postId || req.query.postId;
  if (!postId || !Types.ObjectId.isValid(postId)) throw new CustomError('NotFoundError', 404, 'Post not found');
  const post = await Post.findById(postId);
  if (!post) throw new CustomError('NotFoundError', 404, 'Post not found');

  next();
});
