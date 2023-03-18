import CustomError from '../CustomError';
import { User as UserModel } from '../models/User';
import { verifyJWT } from '../utills/jwt';

// 로그인 시 사용자 정보를 조회, Token을 생성한다.
const SignIn = async (idToken: string) => {
  const user = await UserModel.findByIdToken(idToken);
  if (!user) throw new CustomError('InvaildParameterError', 401, 'User not found');
  // Access Token, Refresh Token 발급
  const { _id, nickName, image, likeLanguages } = user;
  const [accessToken, refreshToken] = await Promise.all([user.generateAccessToken(), user.generateRefreshToken()]);
  return { _id, nickName, image, likeLanguages, accessToken, refreshToken };
};

// Refresh Token을 이용하여 Access Token 재발급한다.
const reissueAccessToken = async (refreshToken: string) => {
  let decodeSuccess = true;
  try {
    const decodeRefreshToken = await verifyJWT(refreshToken);
    if (typeof decodeRefreshToken === 'string') throw new CustomError('JsonWebTokenError', 401, 'Invaild Token');

    const user = await UserModel.findByNickName(decodeRefreshToken.nickName);
    if (!user) throw new CustomError('InvaildParameterError', 401, 'User not found');

    const { _id, nickName, email, image, likeLanguages } = user;
    const accessToken = await user.generateAccessToken();
    return { decodeSuccess, _id, nickName, email, image, likeLanguages, accessToken };
  } catch (err) {
    decodeSuccess = false;
    return { decodeSuccess };
  }
};

export { SignIn, reissueAccessToken };
