import { AdvertisementService } from '../../services/advertisement';
import { Router, Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Advertisement as AdvertisementModel } from '../../models/Advertisement';

const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
        - name: advertisements
          description: 광고에 관련된 API
   */
  app.use('/advertisements', route);


  // #region 광고 상세 보기
  /**
   * @swagger
   * paths:
   *   /advertisements/{id}:
   *    get:
   *      tags:
   *        - advertisements
   *      summary: 광고 상세 보기
   *      description: '광고 상세 정보를 조회한다.'
   *      parameters:
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
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const advertisementId = req.params.id;
      const AdvertisementServiceInstance = new AdvertisementService(AdvertisementModel);
      const advertisement = await AdvertisementServiceInstance.findAdvertisement(advertisementId);
      return res.status(200).json(advertisement);
    }),
  );

  // #region POST - 광고 등록
  /**
   * @swagger
   * paths:
   *   /advertisements:
   *    post:
   *      tags:
   *        - advertisements
   *      summary: 광고 등록
   *      description: '신규 광고를 등록한다.'
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
    }),
  );

  // #region 광고 수정
  /**
   * @swagger
   * paths:
   *   /advertisements/{id}:
   *    patch:
   *      tags:
   *        - advertisements
   *      summary: 광고 수정
   *      description: 광고를 수정한다.
   *      parameters:
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
  route.patch(
    '/:id',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const advertisementDTO = req.body;
      const AdvertisementServiceInstance = new AdvertisementService(AdvertisementModel);
      const advertisement = await AdvertisementServiceInstance.modifyAdvertisement(Types.ObjectId(id), advertisementDTO);

      return res.status(200).json(advertisement);
    }),
  );

  // #region 광고 삭제
  /**
   * @swagger
   * paths:
   *   /advertisements/{id}:
   *    delete:
   *      tags:
   *        - advertisements
   *      summary: 광고 삭제
   *      description: 광고를 삭제한다.
   *      parameters:
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
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const AdvertisementServiceInstance = new AdvertisementService(AdvertisementModel);
      await AdvertisementServiceInstance.deleteAdvertisement(Types.ObjectId(id));
      return res.status(204).json();
    }),
  );

};
