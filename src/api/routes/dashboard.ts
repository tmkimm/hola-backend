import { Router, Request, Response, NextFunction } from 'express';
import { DashboardService } from '../../services/index';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';

const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
        - name: dashboard
        description: 어드민용 대시보드
   */
  app.use('/dashboard', route);

  /**
   * @swagger
   * paths:
   *   /dashboard/users/daily:
   *    get:
   *      tags:
   *        - dashboard
   *      summary: 사용자 데일리 액션
   *      description: 총 회원 수, 오늘 가입자, 오늘 탈퇴자 조회
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  totalUser:
   *                    type: integer
   *                    description: 총 회원 수
   *                  signUp:
   *                    type: integer
   *                    description: 오늘 가입자 수
   *                  signOut:
   *                    type: integer
   *                    description: 오늘 탈퇴자 조회 수
   */
  route.get(
    '/users/daily',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const DashboardServiceInstance = new DashboardService();
      const user = await DashboardServiceInstance.findDailyUser();
      return res.status(200).json(user);
    }),
  );

  /**
   * @swagger
   * paths:
   *   /dashboard/users/history:
   *    get:
   *      tags:
   *        - dashboard
   *      summary: 일자별 회원 가입 현황
   *      description: 조회 기간에 해당되는 가입자 정보 집계
   *      parameters:
   *        - name: startDate
   *          in: query
   *          description: 조회 시작일
   *          required: true
   *          schema:
   *            type: string
   *            example: '2022-09-01'
   *        - name: endDate
   *          in: query
   *          description: 조회 종료일
   *          required: true
   *          schema:
   *            type: string
   *            example: '2022-09-30'
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  type: object
   *                  properties:
   *                    _id:
   *                      type: string
   *                      description: 날짜
   *                    signIn:
   *                      type: integer
   *                      description: 가입자 수
   *                    signOut:
   *                      type: integer
   *                      description: 탈퇴자 수
   *              example:
   *              - _id: '2022-09-01'
   *                signIn: 8
   *                signOut: 3
   */
  route.get(
    '/users/history',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { startDate, endDate } = req.query;
      const DashboardServiceInstance = new DashboardService();
      const user = await DashboardServiceInstance.findUserHistory(startDate, endDate);
      return res.status(200).json(user);
    }),
  );

  /**
   * @swagger
   * paths:
   *   /dashboard/posts/daily:
   *    get:
   *      tags:
   *        - dashboard
   *      summary: 게시글 데일리 액션
   *      description: 총오늘 전체 글 조회 수, 등록된 글, 글 마감 수, 글 삭제 수 조회
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  totalView:
   *                    type: integer
   *                    description: 총 조회수
   *                  created:
   *                    type: integer
   *                    description: 등록된 글
   *                  closed:
   *                    type: integer
   *                    description: 마감된 글
   *                  deleted:
   *                    type: integer
   *                    description: 삭제된 글
   */
  route.get(
    '/posts/daily',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const DashboardServiceInstance = new DashboardService();
      const post = await DashboardServiceInstance.findDailyPost();
      return res.status(200).json(post);
    }),
  );

  /**
   * @swagger
   * paths:
   *   /dashboard/posts/history:
   *    get:
   *      tags:
   *        - dashboard
   *      summary: 일자별 게시글 현황
   *      description: 조회 기간에 해당되는 게시글 정보 집계(일자, 등록된 글, 마감된 글, 삭제된 글)
   *      parameters:
   *        - name: startDate
   *          in: query
   *          description: 조회 시작일
   *          required: true
   *          schema:
   *            type: string
   *            example: '2022-09-01'
   *        - name: endDate
   *          in: query
   *          description: 조회 종료일
   *          required: true
   *          schema:
   *            type: string
   *            example: '2022-09-30'
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  type: object
   *                  properties:
   *                    _id:
   *                      type: string
   *                      description: 날짜
   *                    created:
   *                      type: integer
   *                      description: 등록된 글
   *                    closed:
   *                      type: integer
   *                      description: 마감된 글
   *                    deleted:
   *                      type: integer
   *                      description: 삭제된 글
   *              example:
   *              - _id: '2022-09-01'
   *                created: 8
   *                closed: 3
   *                deleted: 3
   */
  route.get(
    '/posts/history',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { startDate, endDate } = req.query;
      const DashboardServiceInstance = new DashboardService();
      const user = await DashboardServiceInstance.findPostHistory(startDate, endDate);
      return res.status(200).json(user);
    }),
  );

  /**
   * @swagger
   * paths:
   *   /dashboard/posts/filter-rank:
   *    get:
   *      tags:
   *        - dashboard
   *      summary: 가장 많이 조회해 본 언어 필터
   *      description: 조회 기간에 해당되는 언어 필터링 순위
   *      parameters:
   *        - name: startDate
   *          in: query
   *          description: 조회 시작일
   *          required: true
   *          schema:
   *            type: string
   *            example: '2022-09-01'
   *        - name: endDate
   *          in: query
   *          description: 조회 종료일
   *          required: true
   *          schema:
   *            type: string
   *            example: '2022-09-30'
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  type: object
   *                  properties:
   *                    _id:
   *                      type: string
   *                      description: 언어
   *                    count:
   *                      type: integer
   *                      description: 조회 수
   *              example:
   *              - _id: 'javascript'
   *                count: 15
   *              - _id: 'react'
   *                count: 10
   */
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
