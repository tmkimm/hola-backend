import { NextFunction, Request, Response, Router } from 'express';
import { Types } from 'mongoose';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Advertisement as AdvertisementModel } from '../../models/Advertisement';
import { Campaign as CampaignModel } from '../../models/Campaign';
import { CampaignService } from '../../services/campaign';

const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
        - name: campaigns
          description: 캠페인에 관련된 API
   */
  app.use('/campaigns', route);

  // #region 캠페인 리스트 조회(페이징)
  /**
   * @swagger
   * paths:
   *   /campaigns:
   *    get:
   *      tags:
   *        - campaigns
   *      summary: 캠페인 리스트 조회(Pagination)
   *      description: 캠페인 리스트를 조회한다.
   *      parameters:
   *        - name: page
   *          in: query
   *          description: 현재 페이지(기본 1)
   *          required: true
   *          schema:
   *            type: number
   *          example: 1
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Campaign'
   */
  // #endregion
  route.get(
    '/',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { page } = req.query;
      const CampaignServiceInstance = new CampaignService(CampaignModel, AdvertisementModel);
      const campaigns = await CampaignServiceInstance.findCampaignList(page);
      return res.status(200).json(campaigns);
    })
  );

  // #region 캠페인 상세 보기
  /**
   * @swagger
   * paths:
   *   /campaigns/{id}:
   *    get:
   *      tags:
   *        - campaigns
   *      summary: 캠페인 상세 보기
   *      description: '캠페인 상세 정보를 조회한다.'
   *      parameters:
   *        - name: id
   *          in: path
   *          description: 캠페인 Id
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
   *                $ref: '#/components/schemas/Campaign'
   *        404:
   *          description: Campaign not found
   */
  // #endregion
  route.get(
    '/:id',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const campaignId = req.params.id;
      const CampaignServiceInstance = new CampaignService(CampaignModel, AdvertisementModel);
      const campaign = await CampaignServiceInstance.findCampaign(campaignId);
      return res.status(200).json(campaign);
    })
  );

  // #region 캠페인의 광고 리스트 보기
  /**
   * @swagger
   * paths:
   *   /campaigns/{id}/advertisement:
   *    get:
   *      tags:
   *        - campaigns
   *      summary: 캠페인의 광고 리스트 보기
   *      description: '캠페인의 등록된 광고 리스트를 조회한다.'
   *      parameters:
   *        - name: id
   *          in: path
   *          description: 캠페인 Id
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
   */
  // #endregion
  route.get(
    '/:id/advertisement',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const campaignId = req.params.id;
      const CampaignServiceInstance = new CampaignService(CampaignModel, AdvertisementModel);
      const campaign = await CampaignServiceInstance.findAdvertisementInCampaign(campaignId);
      return res.status(200).json(campaign);
    })
  );

  // #region POST - 캠페인 등록
  /**
   * @swagger
   * paths:
   *   /campaigns:
   *    post:
   *      tags:
   *        - campaigns
   *      summary: 캠페인 등록
   *      description: '신규 캠페인를 등록한다.'
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Campaign'
   *      responses:
   *        201:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Campaign'
   *        400:
   *          description: Invaild campaign data
   *        401:
   *          $ref: '#/components/responses/UnauthorizedError'
   */
  // #endregion
  route.post(
    '/',
    asyncErrorWrapper(async function (req: Request, res: Response, next: NextFunction) {
      try {
        const campaignDTO = req.body;
        const CampaignServiceInstance = new CampaignService(CampaignModel, AdvertisementModel);
        const campaign = await CampaignServiceInstance.createCampaign(campaignDTO);
        return res.status(201).json(campaign);
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

  // #region 캠페인 수정
  /**
   * @swagger
   * paths:
   *   /campaigns/{id}:
   *    patch:
   *      tags:
   *        - campaigns
   *      summary: 캠페인 수정
   *      description: 캠페인를 수정한다.
   *      parameters:
   *        - name: id
   *          in: path
   *          description: 캠페인 Id
   *          required: true
   *          example: '635a91e837ad67001412321a'
   *          schema:
   *            type: string
   *      requestBody:
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/Campaign'
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/Campaign'
   *        400:
   *          description: Invaild campaign data
   *        401:
   *          $ref: '#/components/responses/UnauthorizedError'
   */
  // #endregion
  route.patch(
    '/:id',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const campaignDTO = req.body;
      const CampaignServiceInstance = new CampaignService(CampaignModel, AdvertisementModel);
      const campaign = await CampaignServiceInstance.modifyCampaign(Types.ObjectId(id), campaignDTO);

      return res.status(200).json(campaign);
    })
  );

  // #region 캠페인 삭제
  /**
   * @swagger
   * paths:
   *   /campaigns/{id}:
   *    delete:
   *      tags:
   *        - campaigns
   *      summary: 캠페인 삭제
   *      description: 캠페인를 삭제한다.
   *      parameters:
   *        - name: id
   *          in: path
   *          description: 캠페인 Id
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
   *          description: Campaign not found
   */
  // #endregion
  route.delete(
    '/:id',
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const CampaignServiceInstance = new CampaignService(CampaignModel, AdvertisementModel);
      await CampaignServiceInstance.deleteCampaign(Types.ObjectId(id));
      return res.status(204).json();
    })
  );
};
