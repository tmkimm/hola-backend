import { NextFunction, Request, Response, Router } from 'express';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { IUser, User as UserModel } from '../../models/User';
import { AuthService } from '../../services/index';
import { isPasswordValidWithAdmin } from '../middlewares/isPasswordValidWithAdmin';

const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
        - name: admin
   */
  app.use('/admin', route);

  // #region Admin 로그인
  /**
   *
   * @swagger
   * paths:
   *   /admin/login:
   *    post:
   *      tags:
   *        - 어드민
   *      summary: Admin 로그인
   *      description: admin 계정으로 로그인한다.
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                id:
   *                  type: string
   *                  description: admin id
   *                password:
   *                  type: string
   *                  description: admin password
   *              example:
   *                id: "admin"
   *                password: "pw"
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  loginSuccess:
   *                    type: boolean
   *                    description: 로그인 성공 여부
   *                  _id:
   *                    type: string
   *                    description: 사용자 id
   *                  nickName:
   *                    type: string
   *                    description: 닉네임
   *                  image:
   *                    type: string
   *                    description: 사용자 이미지
   *                  accessToken:
   *                    type: string
   *                    description: access token
   *                example:
   *                  loginSuccess: true
   *                  id: "63455237c1ddf6ff6c0d8d94"
   *                  nickName: "hola"
   *                  image: "default.png"
   */
  // #endregion
  route.post(
    '/login',
    isPasswordValidWithAdmin,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { idToken } = req.user as IUser;
      const AuthServiceInstance = new AuthService(UserModel);
      const { _id, nickName, image, likeLanguages, accessToken, refreshToken } = await AuthServiceInstance.SignIn(
        idToken
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
    })
  );
};
