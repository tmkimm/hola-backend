import { Router, Request, Response, NextFunction } from 'express';

const route = Router();

export default (app: Router) => {
  app.use('/logout', route);

  /**
   * @swagger
   * paths:
   *   /logout:
   *    post:
   *      tags:
   *        - login
   *      summary: 로그아웃
   *      description: '로그아웃 처리되며 Refresh Token이 삭제된다.'
   *      responses:
   *        204:
   *          description: successful operation
   */ 

  route.post('/', (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('R_AUTH');
    return res.status(204).json();
  });
};
