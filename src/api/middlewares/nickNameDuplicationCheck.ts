import { Request, Response, NextFunction } from 'express';
import { User } from '../../models/User';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';

// 회원 정보 수정 시 닉네임이 중복되었는지 체크한다.
const nickNameDuplicationCheck = asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const nickName = req.query.nickName || req.body.nickName;
  if (nickName) {
    const user = await User.findByNickName(nickName);
    if (user) {
      res.status(200).json({
        message: `Nickname is duplicated.`,
        isExists: true,
      });
    }
  }
  next();
});

export { nickNameDuplicationCheck };
