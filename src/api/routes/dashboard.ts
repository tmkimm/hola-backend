import { Router, Request, Response, NextFunction } from 'express';
import { DashboardService } from '../../services/index';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';

const route = Router();

export default (app: Router) => {
  /*
    dashboard에 관련된 Router를 정의한다.
    */
  app.use('/dashboard', route);

  // 사용자 정보 데일리(현재 총 회원 수, 오늘 가입자, 오늘 탈퇴자)
  route.get(
    '/users/daily',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const DashboardServiceInstance = new DashboardService();
      const user = await DashboardServiceInstance.findDailyUser();
      return res.status(200).json(user);
    }),
  );

  // 일자별 회원 가입 현황(일자, 신규 가입자, 탈퇴자)
  route.get(
    '/users/history',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const DashboardServiceInstance = new DashboardService();
      const user = await DashboardServiceInstance.findUserHistory();
      return res.status(200).json(user);
    }),
  );

  // 게시글 데일리(오늘 전체 글 조회 수, 등록된 글, 글 마감 수, 글 삭제 수 )
  route.get(
    '/posts/daily',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const DashboardServiceInstance = new DashboardService();
      const post = await DashboardServiceInstance.findDailyPost();
      return res.status(200).json(post);
    }),
  );

  // 일자별 게시글 현황(일자, 등록된 글, 마감된 글, 삭제된 글)
  route.get(
    '/posts/history',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const DashboardServiceInstance = new DashboardService();
      const user = await DashboardServiceInstance.findPostHistory();
      return res.status(200).json(user);
    }),
  );

  // 가장 많이 조회해 본 언어 필터
  route.get(
    '/posts/filter-rank',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const DashboardServiceInstance = new DashboardService();
      const user = await DashboardServiceInstance.findPostFilterRank();
      return res.status(200).json(user);
    }),
  );
};
