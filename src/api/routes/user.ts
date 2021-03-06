import { Router, Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { isString } from '../../utills/isStringEmpty';
import { IUser, User as UserModel } from '../../models/User';
import { UserService, NotificationService } from '../../services/index';
import { nickNameDuplicationCheck, isAccessTokenValid, isUserIdValid } from '../middlewares/index';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Post as PostModel } from '../../models/Post';
import { Notification as NotificationModel } from '../../models/Notification';

const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  // s3 pre-sign url 발급
  route.post(
    '/sign',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { fileName } = req.body;
      const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
      const signedUrlPut = await UserServiceInstance.getPreSignUrl(fileName);

      return res.status(200).json({
        preSignUrl: signedUrlPut,
      });
    }),
  );

  // 사용자 정보 조회
  route.get(
    '/',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { nickName } = req.query;
      if (!isString(nickName)) {
        return res.status(400).json({
          message: `parameter is incorrect`,
        });
      }

      const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
      const user = await UserServiceInstance.findByNickName(nickName);
      return res.status(200).json(user);
    }),
  );

  // 사용자 정보 상세 보기
  route.get(
    '/:id',
    isUserIdValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
      const user = await UserServiceInstance.findById(Types.ObjectId(id));

      return res.status(200).json(user);
    }),
  );

  // 사용자 정보 수정
  route.patch(
    '/:id',
    isUserIdValid,
    isAccessTokenValid,
    nickNameDuplicationCheck,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { _id: tokenUserId } = req.user as IUser;

      const userDTO = req.body;
      const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
      const { userRecord, accessToken, refreshToken } = await UserServiceInstance.modifyUser(
        Types.ObjectId(id),
        tokenUserId,
        userDTO,
      );

      res.cookie('R_AUTH', refreshToken, {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 14, // 2 Week
      });

      return res.status(200).json({
        _id: userRecord._id,
        nickName: userRecord.nickName,
        image: userRecord.image,
        accessToken,
        isExists: false,
      });
    }),
  );

  // 사용자 닉네임 중복 체크
  route.get(
    '/:id/exists',
    nickNameDuplicationCheck,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      return res.status(200).json({
        isExists: false,
      });
    }),
  );

  // 사용자 정보 삭제(회원탈퇴)
  route.delete(
    '/:id',
    isUserIdValid,
    isAccessTokenValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { _id: tokenUserId } = req.user as IUser;

      const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
      await UserServiceInstance.deleteUser(Types.ObjectId(id), tokenUserId);
      return res.clearCookie('R_AUTH');
      return res.status(204).json();
    }),
  );

  // 사용자 관심 등록 리스트 조회
  route.get('/likes/:id', isUserIdValid, async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
    const user = await UserServiceInstance.findUserLikes(Types.ObjectId(id));
    return res.status(200).json(user);
  });

  // 사용자 읽은 목록  조회
  route.get(
    '/read-list/:id',
    isUserIdValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
      const user = await UserServiceInstance.findReadList(Types.ObjectId(id));

      return res.status(200).json(user);
    }),
  );

  // 사용자 작성 글 목록 조회
  route.get(
    '/myPosts/:id',
    isUserIdValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
      const user = await UserServiceInstance.findMyPosts(Types.ObjectId(id));

      return res.status(200).json(user);
    }),
  );
};
