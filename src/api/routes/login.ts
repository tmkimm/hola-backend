import { Router, Request, Response, NextFunction } from 'express';
import { AuthService, UserService } from '../../services/index';
import { isUserIdValid, isTokenValidWithOauth, nickNameDuplicationCheck, autoSignUp } from '../middlewares/index';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Post as PostModel } from '../../models/Post';
import { IUser, User as UserModel } from '../../models/User';
import { Notification as NotificationModel } from '../../models/Notification';

const route = Router();

export default (app: Router) => {
  /*
    로그인에 관련된 Router를 정의한다.
    로그인 시 각 소셜 로그인 Oauth 서버를 통해 올바른 토큰인지 확인한다.(idToken)
    # POST /login/signup : 로그인 후 회원 가입
    # POST /login/google : Oauth 구글 로그인
    # POST /login/github : Oauth 깃 로그인
    # POST /login/kakao : Oauth 카카오 로그인
    */
  app.use('/login', route);

  // Oauth2.0 로그인
  // isTokenValidWithGoogle : 클라이언트에게 전달받은 idToken을 이용해 유효성 검증 후 사용자 정보를 가져온다.
  route.post(
    '/',
    isTokenValidWithOauth,
    autoSignUp,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { idToken } = req.user as IUser;
      const AuthServiceInstance = new AuthService(UserModel);
      const { _id, nickName, image, likeLanguages, accessToken, refreshToken } = await AuthServiceInstance.SignIn(
        idToken,
      );
      res.cookie('R_AUTH', refreshToken, {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 14, // 2 Week
      });
      return res.status(200).json({
        loginSuccess: true,
        _id,
        nickName,
        image,
        likeLanguages,
        accessToken,
      });
    }),
  );

  // 회원 가입
  // - 로그인 시 회원 정보가 Insert되므로 회원 가입 시 정보를 수정한다.
  // - 회원 가입 완료 시 Refresh Token과 Access Token이 발급된다.
  route.post(
    '/signup',
    nickNameDuplicationCheck,
    isUserIdValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.body;
      const userDTO = req.body;
      delete userDTO.id;

      // 회원 정보 수정(등록)
      const UserServiceInstance = new UserService(PostModel, UserModel, NotificationModel);
      const { userRecord } = await UserServiceInstance.modifyUser(id, id, userDTO);
      // AccessToken, RefreshToken 발급
      const AuthServiceInstance = new AuthService(UserModel);
      const { accessToken, refreshToken } = await AuthServiceInstance.SignIn(userRecord.idToken);

      res.cookie('R_AUTH', refreshToken, {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 14, // 2 Week
      });

      return res.status(200).json({
        loginSuccess: true,
        _id: userRecord._id,
        nickName: userRecord.nickName,
        image: userRecord.image,
        accessToken,
      });
    }),
  );
};
