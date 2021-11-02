import { Request, Response, NextFunction } from 'express';
import { User } from '../../models/User';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import CustomError from '../../CustomError';

// 로그인 시 회원가입 여부를 판단한다.
// loginSuccess
// true: 로그인 완료
// false: 로그인 실패. 회원 가입 필요.
const autoSignUp = asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.idToken) throw new CustomError('OauthError', 400, 'Oauth parameter is Invalid');

  const user = await User.findByIdToken(req.user.idToken);
  if (!user) {
    const newUser = await User.create(req.user);
    return res.status(200).json({
      _id: newUser._id,
      loginSuccess: false,
      message: '회원 가입을 진행해야 합니다.',
    });
  }
  if (!user.nickName) {
    return res.status(200).json({
      _id: user._id,
      loginSuccess: false,
      message: '회원 가입을 진행해야 합니다.',
    });
  }
  next();
});

export { autoSignUp };
