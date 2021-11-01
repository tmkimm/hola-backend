import { Router, Request, Response, NextFunction } from 'express';

const route = Router();

export default (app: Router) => {
  /*
    로그아웃에 관련된 Router를 정의한다.
    # POST /logout : 로그아웃
    */
  app.use('/logout', route);

  // 로그아웃(Refresh Token 삭제)
  route.post('/', (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('R_AUTH');
    res.status(204).json();
  });
};
