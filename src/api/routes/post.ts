import { Router, Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { IUser, User as UserModel } from '../../models/User';
import {
  checkPost,
  isPostValid,
  isAccessTokenValid,
  getUserIdByAccessToken,
  isPostIdValid,
} from '../middlewares/index';
import { PostService } from '../../services/index';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Post as PostModel } from '../../models/Post';
import { Notification as NotificationModel } from '../../models/Notification';

const route = Router();

export default (app: Router) => {
  /*
    글에 관련된 Router를 정의한다.
    등록 / 수정 / 삭제하려는 사용자의 정보는 Access Token을 이용하여 처리한다.
    
    # GET /posts : 글 리스트 조회(pagenation, sort, query select)
    # POST /posts/ : 신규 글 등록
    # GET /posts/:id : 글 상세 정보 조회
    # PATCH /posts/:id : 글 정보 수정
    # DELETE /posts/:id : 글 삭제

    # POST /posts/likes : 좋아요 등록
    # DELETE /posts/likes/:id : 좋아요 삭제
    */
  app.use('/posts', route);

  // 글 리스트 조회
  route.get(
    '/',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { offset, limit, sort, language, period, isClosed } = req.query;
      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      const posts = await PostServiceInstance.findPost(offset, limit, sort, language, period, isClosed);

      return res.status(200).json(posts);
    }),
  );

  // 메인에서의 글 추천
  route.get(
    '/recommend',
    getUserIdByAccessToken,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { _id: userId } = req.user as IUser;
      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      const posts = await PostServiceInstance.recommendToUserFromMain(userId);

      return res.status(200).json(posts);
    }),
  );

  // 글에서의 글 추천
  route.get(
    '/:id/recommend',
    getUserIdByAccessToken,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const postId = req.params.id;
      const { _id: userId } = req.user as IUser;

      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      const post = await PostServiceInstance.recommendToUserFromPost(Types.ObjectId(postId), userId);

      return res.status(200).json(post);
    }),
  );

  // 글 상세 보기
  // 로그인된 사용자일 경우 읽은 목록을 추가한다.
  route.get(
    '/:id',
    isPostIdValid,
    getUserIdByAccessToken,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const postId = req.params.id;
      const { _id: userId } = req.user as IUser;

      const readList = req.cookies.RVIEW;
      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      const post = await PostServiceInstance.findPostDetail(Types.ObjectId(postId));
      const { updateReadList, isAlreadyRead } = await PostServiceInstance.increaseView(
        Types.ObjectId(postId),
        userId,
        readList,
      );
      if (!isAlreadyRead) {
        // 쿠키는 당일만 유효
        const untilMidnight = new Date();
        untilMidnight.setHours(24, 0, 0, 0);
        res.cookie('RVIEW', updateReadList, {
          sameSite: 'none',
          httpOnly: true,
          secure: true,
          expires: untilMidnight,
        });
      }

      return res.status(200).json(post);
    }),
  );

  // 알림을 통한 글 상세 보기
  route.get(
    '/:id/notice',
    isPostIdValid,
    getUserIdByAccessToken,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const postId = req.params.id;
      const { _id: userId } = req.user as IUser;

      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      const post = await PostServiceInstance.findPostDetailAndUpdateReadAt(Types.ObjectId(postId), userId);

      return res.status(200).json(post);
    }),
  );

  // 사용자의 글 관심 등록 여부
  route.get(
    '/:id/isLiked',
    getUserIdByAccessToken,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const postId = req.params.id;
      const { _id: userId } = req.user as IUser;

      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      const isLiked = await PostServiceInstance.findUserLiked(Types.ObjectId(postId), userId);

      return res.status(200).json({
        isLiked,
      });
    }),
  );

  // 글의 관심 등록한 사용자 리스트 조회
  route.get(
    '/:id/likes',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const postId = req.params.id;
      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      const likeUsers = await PostServiceInstance.findLikeUsers(Types.ObjectId(postId));

      return res.status(200).json({
        likeUsers,
      });
    }),
  );

  // 글 등록
  route.post(
    '/',
    checkPost,
    isPostValid,
    isAccessTokenValid,
    asyncErrorWrapper(async function (req: Request, res: Response, next: NextFunction) {
      try {
        const postDTO = req.body;
        const { _id: userId } = req.user as IUser;

        const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
        const post = await PostServiceInstance.registerPost(userId, postDTO);
        return res.status(201).json(post);
      } catch (error) {
        return res.status(400).json({
          errors: [
            {
              location: 'body',
              param: 'name',
              error: 'TypeError',
              message: 'must be String',
            },
          ],
          error,
        });
      }
    }),
  );

  // 글 수정
  route.patch(
    '/:id',
    isAccessTokenValid,
    checkPost,
    isPostValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { _id: tokenUserId } = req.user as IUser;

      const postDTO = req.body;

      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      const post = await PostServiceInstance.modifyPost(Types.ObjectId(id), tokenUserId, postDTO);

      return res.status(200).json(post);
    }),
  );

  // 글 글 삭제
  route.delete(
    '/:id',
    isPostIdValid,
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { _id: tokenUserId } = req.user as IUser;

      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      await PostServiceInstance.deletePost(Types.ObjectId(id), tokenUserId);
      return res.status(204).json();
    }),
  );

  // 좋아요 등록
  route.post(
    '/likes',
    isAccessTokenValid,
    isPostIdValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { postId } = req.body;
      const { _id: userId } = req.user as IUser;

      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      const post = await PostServiceInstance.addLike(Types.ObjectId(postId), userId);

      return res.status(201).json({ likeUsers: post.likes });
    }),
  );

  // 좋아요 삭제
  route.delete(
    '/likes/:id',
    isAccessTokenValid,
    isPostIdValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const postId = req.params.id; // 사용자 id
      const { _id: userId } = req.user as IUser;

      const PostServiceInstance = new PostService(PostModel, UserModel, NotificationModel);
      const post = await PostServiceInstance.deleteLike(Types.ObjectId(postId), userId);
      return res.status(201).json({ likeUsers: post.likes });
    }),
  );
};
