import { Router, Request, Response, NextFunction } from 'express';
import { SignIn } from '../../services/auth';
import { modifyUser } from '../../services/user';
import { isUserIdValid, isTokenValidWithOauth, nickNameDuplicationCheck, autoSignUp } from '../middlewares/index';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Post as PostModel } from '../../models/Post';
import { IUser, User as UserModel } from '../../models/User';
import { Notification as NotificationModel } from '../../models/Notification';

const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
        - name: login
          description: 로그인에 관련된 API
   */
  app.use('/login', route);
  /**
   * @swagger
   *  components:
   *  schemas:
   *    loginSuccess:
   *      properties:
   *        _id:
   *          type: string
   *          description: 사용자 ID
   *          example: '61063af4ed4b420bbcfa0b4c'
   *        nickName:
   *          type: string
   *          description: 닉네임
   *          example: 'hola!'
   *        image:
   *          type: string
   *          description: 사용자 이미지 명
   *          example: 'default.PNG'
   *        accessToken:
   *          type: string
   *          description: access token
   *        loginSuccess:
   *          type: boolean
   *          description: 로그인 성공 여부
   *          example: true
   *        likeLanguages:
   *          type: array
   *          description: 관심 등록 언어
   *          items:
   *            type: string
   *    SignUpRequired:
   *      properties:
   *        _id:
   *          type: string
   *          description: 사용자 ID
   *          example: '61063af4ed4b420bbcfa0b4c'
   *        loginSuccess:
   *          type: boolean
   *          description: 로그인 성공 여부(false일 경우 회원가입 필요)
   *          example: false
   *        message:
   *          type: string
   *          description: 메시지
   *          example: '회원 가입을 진행해야 합니다.'
   *    nickNameDuplicate:
   *      properties:
   *        isExists::
   *          type: boolean
   *          description: '닉네임 중복 여부(true: 중복)'
   *          example: true
   *        message:
   *          type: string
   *          description: 메시지
   *          example: 'Nickname is duplicated'
   */
  /**
   * @swagger
   * paths:
   *   /login:
   *    post:
   *      tags:
   *        - login
   *      summary: 로그인(Oauth 2.0)
   *      description: '소셜 로그인(google, gitgub, kakao)'
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                loginType:
   *                  type: string
   *                  description : '로그인 종류(google, gitgub, kakao)'
   *                  example: 'github'
   *                code:
   *                  type: string
   *                  description : '클라이언트에게 전달받은 idToken'
   *                  example: '12412lnklsnadlkfja'
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                oneOf:
   *                  - $ref: '#/components/schemas/loginSuccess'
   *                  - $ref: '#/components/schemas/SignUpRequired'
   *        400:
   *          description: Oauth parameter is Invalid
   */
  route.post(
    '/',
    isTokenValidWithOauth, // 클라이언트에게 전달받은 idToken을 이용해 유효성 검증 후 사용자 정보를 가져온다.
    autoSignUp,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      // 로그인 시 각 소셜 로그인 Oauth 서버를 통해 올바른 토큰인지 확인한다.(idToken)
      const { idToken } = req.user as IUser;
      const { _id, nickName, image, likeLanguages, accessToken, refreshToken } = await SignIn(idToken);
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

  /**
   * @swagger
   * paths:
   *   /login/signup:
   *    post:
   *      tags:
   *        - login
   *      summary: 회원 가입
   *      description: '로그인 시 회원 정보가 Insert되므로 회원 가입 시 정보를 수정한다. 회원 가입 완료 시 Refresh Token과 Access Token이 발급된다.'
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/User'
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                oneOf:
   *                  - $ref: '#/components/schemas/loginSuccess'
   *                  - $ref: '#/components/schemas/nickNameDuplicate'
   *        400:
   *          description: Oauth parameter is Invalid
   *        404:
   *          description: User not found
   */
  route.post(
    '/signup',
    nickNameDuplicationCheck,
    isUserIdValid,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.body;
      const userDTO = req.body;
      delete userDTO.id;

      // 회원 정보 수정(등록)
      const { userRecord } = await modifyUser(id, id, userDTO);
      // AccessToken, RefreshToken 발급
      const { accessToken, refreshToken } = await SignIn(userRecord.idToken);

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
