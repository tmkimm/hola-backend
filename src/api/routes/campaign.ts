import { NextFunction, Request, Response, Router } from 'express';
import { Types } from 'mongoose';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import { Advertisement as AdvertisementModel } from '../../models/Advertisement';
import { AdvertisementLog as AdvertisementLogModel } from '../../models/AdvertisementLog';
import { Campaign as CampaignModel } from '../../models/Campaign';
import { CampaignService } from '../../services/campaign';
import { isAccessTokenValidWithAdmin } from '../middlewares/isAccessTokenValidWithAdmin';

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
   *        - 캠페인 관리(어드민)
   *      summary: 캠페인 리스트 조회(Pagination)
   *      description: 캠페인 리스트를 조회한다.
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: false
   *          schema:
   *            type: string
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
    isAccessTokenValidWithAdmin,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { page } = req.query;
      const CampaignServiceInstance = new CampaignService(CampaignModel, AdvertisementModel, AdvertisementLogModel);
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
   *        - 캠페인 관리(어드민)
   *      summary: 캠페인 상세 보기
   *      description: '캠페인 상세 정보를 조회한다.'
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: false
   *          schema:
   *            type: string
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
    isAccessTokenValidWithAdmin,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const campaignId = req.params.id;
      const CampaignServiceInstance = new CampaignService(CampaignModel, AdvertisementModel, AdvertisementLogModel);
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
   *        - 캠페인 관리(어드민)
   *      summary: 캠페인의 광고 리스트 보기
   *      description: '캠페인의 등록된 광고 리스트를 조회한다.'
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: false
   *          schema:
   *            type: string
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
    '/:id/advertisements',
    isAccessTokenValidWithAdmin,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const campaignId = req.params.id;
      const CampaignServiceInstance = new CampaignService(CampaignModel, AdvertisementModel, AdvertisementLogModel);
      const campaign = await CampaignServiceInstance.findAdvertisementInCampaign(campaignId);
      return res.status(200).json(campaign);
    })
  );

  // #region 광고 성과 집계
  /**
   * @swagger
   * paths:
   *   /campaigns/{id}/result:
   *    get:
   *      tags:
   *        - 캠페인 관리(어드민)
   *      summary: 캠페인의 광고 성과 집계
   *      description: '광고 성과를 조회한다.'
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: false
   *          schema:
   *            type: string
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
   *                type: object
   *                properties:
   *                  advertisementType:
   *                    type: string
   *                    description: 광고 유형(banner, event)
   *                    example: 'banner'
   *                  advertisementId:
   *                    type: string
   *                    description: 광고 ID
   *                    example: '6513fd110c19093e9896c9a2'
   *                  impression:
   *                    type: number
   *                    description: 노출 수
   *                    example: 10000
   *                  reach:
   *                    type: number
   *                    description: 클릭 수
   *                    example: 2000
   *                  reachRate:
   *                    type: string
   *                    description: 클릭률(%)
   *                    example: 20%
   *                  reachPrice:
   *                    type: number
   *                    description: 클릭 비용(클릭 수 * 전환당 단가)
   *                    example: 1200000
   */
  // #endregion
  route.get(
    '/:id/result',
    isAccessTokenValidWithAdmin,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const campaignId = req.params.id;
      const CampaignServiceInstance = new CampaignService(CampaignModel, AdvertisementModel, AdvertisementLogModel);
      const campaign = await CampaignServiceInstance.findCampaignResult(campaignId);
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
   *        - 캠페인 관리(어드민)
   *      summary: 캠페인 등록
   *      description: '신규 캠페인를 등록한다.'
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
    isAccessTokenValidWithAdmin,
    asyncErrorWrapper(async function (req: Request, res: Response, next: NextFunction) {
      try {
        const campaignDTO = req.body;
        const CampaignServiceInstance = new CampaignService(CampaignModel, AdvertisementModel, AdvertisementLogModel);
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
   *    put:
   *      tags:
   *        - 캠페인 관리(어드민)
   *      summary: 캠페인 수정
   *      description: 캠페인를 수정한다.
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: false
   *          schema:
   *            type: string
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
  route.put(
    '/:id',
    isAccessTokenValidWithAdmin,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const campaignDTO = req.body;
      const CampaignServiceInstance = new CampaignService(CampaignModel, AdvertisementModel, AdvertisementLogModel);
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
   *        - 캠페인 관리(어드민)
   *      summary: 캠페인 삭제
   *      description: 캠페인를 삭제한다.
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: false
   *          schema:
   *            type: string
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
    isAccessTokenValidWithAdmin,
    asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const CampaignServiceInstance = new CampaignService(CampaignModel, AdvertisementModel, AdvertisementLogModel);
      await CampaignServiceInstance.deleteCampaign(Types.ObjectId(id));
      return res.status(204).json();
    })
  );
};
