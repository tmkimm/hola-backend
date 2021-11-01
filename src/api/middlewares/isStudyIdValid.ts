import { Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { Study } from '../../models/Study';
import { asyncErrorWrapper } from '../../asyncErrorWrapper';
import CustomError from '../../CustomError';

// 스터디 id가 존재하는지 확인한다.
const isStudyIdValid = asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const studyId = req.params.id;

  if (!studyId || !Types.ObjectId.isValid(studyId)) throw new CustomError('NotFoundError', 404, 'Study not found');
  const study = await Study.findById(studyId);
  if (!study) throw new CustomError('NotFoundError', 404, 'Study not found');

  next();
});

export { isStudyIdValid };
