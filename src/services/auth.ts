import CustomError from '../CustomError';
import { IUserModel } from '../models/User';
import { verifyJWT } from '../utills/jwt';

export class AuthService {
  constructor(protected userModel: IUserModel) {}

  // 로그인 시 사용자 정보를 조회하고 Token을 생성한다.
  async SignIn(idToken: string) {
    const user = await this.userModel.findByIdToken(idToken);
    if (!user) throw new CustomError('InvaildParameterError', 401, 'User not found');

    // Access Token, Refresh Token 발급
    const { _id, nickName, image, likeLanguages } = user;
    const [accessToken, refreshToken] = await Promise.all([user.generateAccessToken(), user.generateRefreshToken()]);

    return { _id, nickName, image, likeLanguages, accessToken, refreshToken };
  }

  // Refresh Token을 이용하여 Access Token 재발급한다.
  async reissueAccessToken(refreshToken: string) {
    let decodeSuccess = true;
    try {
      const decodeRefreshToken = await verifyJWT(refreshToken);
      if (typeof decodeRefreshToken === 'string') throw new CustomError('JsonWebTokenError', 401, 'Invaild Token');

      const user = await this.userModel.findByNickName(decodeRefreshToken.nickName);
      if (!user) throw new CustomError('InvaildParameterError', 401, 'User not found');

      const { _id, nickName, email, image, likeLanguages } = user;
      const accessToken = await user.generateAccessToken();
      return { decodeSuccess, _id, nickName, email, image, likeLanguages, accessToken };
    } catch (err) {
      decodeSuccess = false;
      return { decodeSuccess };
    }
  }
}
