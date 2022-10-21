import { Router, Request, Response, NextFunction } from 'express';
import { DashboardService } from '../../services/index';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';

const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * paths:
   *   /product:
   *    post:
   *      tags: [제품]
   *      summary: 제품의 명칭과 셀렉트, 카테고리를 POST요청
   *      description: 제품의 국,영문 명칭과 셀렉트, 카테고리를 요청해서 관리자페이지에 랜더
   *      parameters:
   *        - name: productNameKO
   *          in: body
   *          description: 제품 국문 이름
   *          enum: [연필 깍기, 명함]
   *          example: 공구류
   *        - name: productNameEN
   *          in: body
   *          description: 제품 영문 이름 이 부분이 나중에 url 끝부분이 됨
   *          enum: [hotsource]
   *          example: hotsource
   *      responses:
   *        200:
   *          description: OK 들어 간 데이터가 다시 반환
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Product'
   *        400:
   *          description: Invalid request
   *        409:
   *          description: Not have that kind of product
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
      const { startDate, endDate } = req.query;
      const DashboardServiceInstance = new DashboardService();
      const user = await DashboardServiceInstance.findUserHistory(startDate, endDate);
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
      const { startDate, endDate } = req.query;
      const DashboardServiceInstance = new DashboardService();
      const user = await DashboardServiceInstance.findPostHistory(startDate, endDate);
      return res.status(200).json(user);
    }),
  );

  // 가장 많이 조회해 본 언어 필터
  route.get(
    '/posts/filter-rank',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { startDate, endDate } = req.query;
      const DashboardServiceInstance = new DashboardService();
      const user = await DashboardServiceInstance.findPostFilterRank(startDate, endDate);
      return res.status(200).json(user);
    }),
  );
};
