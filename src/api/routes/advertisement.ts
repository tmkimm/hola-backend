import { NextFunction, Request, Response, Router } from 'express';
import { Types } from 'mongoose';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Advertisement as AdvertisementModel } from '../../models/Advertisement';
import { AdvertisementLog as AdvertisementLogModel } from '../../models/AdvertisementLog';
import { AdvertisementService } from '../../services/advertisement';
import CustomError from '../../CustomError';
import { AdvertisementLogService } from '../../services/advertisementLog';
import { isAccessTokenValidWithAdmin } from '../middlewares/isAccessTokenValidWithAdmin';
import { checkADTypeDuplication } from '../middlewares/checkADTypeDuplication';

const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
        - name: advertisements
          description: 광고에 관련된 API
   */
  app.use('/advertisements', route);

  // #region POST - 광고 등록
  /**
   * @swagger
   * paths:
   *   /advertisements/event-log:
   *    post:
   *      tags:
   *        - 광고
   *      summary: 광고 이벤트 추적 로깅
   *      description: '광고가 노출되었을때 이벤트를 추적한다.'
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                advertisementId:
   *                  type: string
   *                  description: Advertisement ID
   *                  example: 6513fd110c19093e9896c9a2
   *                logType:
   *                  type: string
   *                  description: 로그유형(impression 노출, reach 도달)
   *                  example: impression
   *      responses:
   *        204:
   *          description: successful operation
   */
  // #endregion
  route.post(
    '/event-log',
    asyncErrorWrapper(async function (req: Request, res: Response, next: NextFunction) {
      const { advertisementId, logType } = req.body;
      const AdvertisementLogServiceInstance = new AdvertisementLogService(AdvertisementLogModel);
      if (!advertisementId) throw new CustomError('NotFoundError', 404, '"advertisementId" not found');

      await AdvertisementLogServiceInstance.createEventLog(Types.ObjectId(advertisementId), logType);
      return res.status(204).json();
    })
  );

  // #region 진행중인 배너 광고 조회
  /**
   * @swagger
   * paths:
   *   /advertisements/banner:
   *    get:
   *      tags:
   *        - 광고
   *      summary: 진행중인 배너 광고 조회
   *      description: '배너를 조회한다.'
   *      parameters:
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/Advertisement'
   */
  // #endregion
  route.get(
    '/banner',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const AdvertisementServiceInstance = new AdvertisementService(AdvertisementModel);
      const advertisement = await AdvertisementServiceInstance.findActiveBanner();
      return res.status(200).json(advertisement);
    })
  );

  // #region 진행중인 공모전 배너 조회
  /**
   * @swagger
   * paths:
   *   /advertisements/eventBanner:
   *    get:
   *      tags:
   *        - 광고
   *      summary: 진행중인 공모전 배너 조회
   *      description: '공모전 배너를 조회한다.'
   *      parameters:
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/Advertisement'
   */
  // #endregion
  route.get(
    '/eventBanner',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const AdvertisementServiceInstance = new AdvertisementService(AdvertisementModel);
      const advertisement = await AdvertisementServiceInstance.findActiveEventBanner();
      return res.status(200).json(advertisement);
    })
  );

  // #region 광고 상세 보기
  /**
   * @swagger
   * paths:
   *   /advertisements/{id}:
   *    get:
   *      tags:
   *        - 광고
   *      summary: 광고 상세 보기
   *      description: '광고 상세 정보를 조회한다.'
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: false
   *          schema:
   *            type: string
   *        - name: id
   *          in: path
   *          description: 광고 Id
   *          required: true
   *          example: '635a91e837ad67001412321a'
   *          schema:
   *            type: string
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/Advertisement'
   *        404:
   *          description: Advertisement not found
   */
  // #endregion
  route.get(
    '/:id',
    isAccessTokenValidWithAdmin,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const advertisementId = req.params.id;
      const AdvertisementServiceInstance = new AdvertisementService(AdvertisementModel);
      const advertisement = await AdvertisementServiceInstance.findAdvertisement(Types.ObjectId(advertisementId));
      return res.status(200).json(advertisement);
    })
  );

  // #region POST - 광고 등록
  /**
   * @swagger
   * paths:
   *   /advertisements:
   *    post:
   *      tags:
   *        - 광고
   *      summary: 광고 등록
   *      description: '신규 광고를 등록한다.'
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: false
   *          schema:
   *            type: string
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Advertisement'
   *      responses:
   *        201:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Advertisement'
   *        400:
   *          description: Invaild advertisement data
   *        401:
   *          $ref: '#/components/responses/UnauthorizedError'
   */
  // #endregion
  route.post(
    '/',
    isAccessTokenValidWithAdmin,
    checkADTypeDuplication,
    asyncErrorWrapper(async function (req: Request, res: Response, next: NextFunction) {
      try {
        const advertisementDTO = req.body;
        const AdvertisementServiceInstance = new AdvertisementService(AdvertisementModel);
        const advertisement = await AdvertisementServiceInstance.createAdvertisement(advertisementDTO);
        return res.status(201).json(advertisement);
      } catch (error) {
        return res.status(400).json({
          errors: [
            {
              location: 'body',
              param: 'name',
              error: 'TypeError',
              message: 'must be String',
            },
          ],
          error,
        });
      }
    })
  );

  // #region 광고 수정
  /**
   * @swagger
   * paths:
   *   /advertisements/{id}:
   *    put:
   *      tags:
   *        - 광고
   *      summary: 광고 수정
   *      description: 광고를 수정한다.
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: false
   *          schema:
   *            type: string
   *        - name: id
   *          in: path
   *          description: 광고 Id
   *          required: true
   *          example: '635a91e837ad67001412321a'
   *          schema:
   *            type: string
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Advertisement'
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Advertisement'
   *        400:
   *          description: Invaild advertisement data
   *        401:
   *          $ref: '#/components/responses/UnauthorizedError'
   */
  // #endregion
  route.put(
    '/:id',
    isAccessTokenValidWithAdmin,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const advertisementDTO = req.body;
      const AdvertisementServiceInstance = new AdvertisementService(AdvertisementModel);
      const advertisement = await AdvertisementServiceInstance.modifyAdvertisement(
        Types.ObjectId(id),
        advertisementDTO
      );

      return res.status(200).json(advertisement);
    })
  );

  // #region 광고 삭제
  /**
   * @swagger
   * paths:
   *   /advertisements/{id}:
   *    delete:
   *      tags:
   *        - 광고
   *      summary: 광고 삭제
   *      description: 광고를 삭제한다.
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: false
   *          schema:
   *            type: string
   *        - name: id
   *          in: path
   *          description: 광고 Id
   *          required: true
   *          example: '60213d1c3126991a7cd1d287'
   *          schema:
   *            type: string
   *      responses:
   *        204:
   *          description: successful operation
   *        401:
   *          $ref: '#/components/responses/UnauthorizedError'
   *        404:
   *          description: Advertisement not found
   */
  // #endregion
  route.delete(
    '/:id',
    isAccessTokenValidWithAdmin,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const AdvertisementServiceInstance = new AdvertisementService(AdvertisementModel);
      await AdvertisementServiceInstance.deleteAdvertisement(Types.ObjectId(id));
      return res.status(204).json();
    })
  );
};
