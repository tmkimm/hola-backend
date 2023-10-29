import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import CustomError from '../../CustomError';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import eventList from '../../eventList';

const checkEvent = [
  body('title').isString().withMessage('"title" Invaild datatype(String)').optional({ nullable: true }),
  body('content').isString().withMessage('"content" Invaild datatype(String)').optional({ nullable: true }),
  body('onlineOrOffline')
    .isString()
    .withMessage('"onlineOrOffline" Invaild datatype(String)')
    .optional({ nullable: true }),
  body('place').isString().withMessage('"place" Invaild datatype(String)').optional({ nullable: true }),
  body('organization').isString().withMessage('"organization" Invaild datatype(String)').optional({ nullable: true }),
  body('link').isString().withMessage('"link" Invaild datatype(String)').optional({ nullable: true }),
  body('imageUrl').isString().withMessage('"imageUrl" Invaild datatype(String)').optional({ nullable: true }),
  body('startDate').isDate().withMessage('"startDate" Invaild datatype(Date)').optional({ nullable: true }),
  body('endDate').isDate().withMessage('"endDate" Invaild datatype(Date)').optional({ nullable: true }),
  body('eventType')
    .custom((value, { req }) => {
      return eventList.indexOf(value) > -1;
    })
    .withMessage('Invaild event list'),
];

// Event 유효성 검증 미들웨어
const isEventValid = asyncErrorWrapper(async function (req: Request, res: Response, next: NextFunction) {
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('ContentInvaildError', 400, errors.array()[0].msg);
  }

  next();
});

export { checkEvent, isEventValid };
