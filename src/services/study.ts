import sanitizeHtml from 'sanitize-html';
import { Types } from 'mongoose';
import { IStudy, IStudyModel, IStudyDocument } from '../models/Study';
import { INotificationModel } from '../models/Notification';
import { IUserModel } from '../models/User';
import CustomError from '../CustomError';

export class StudyService {
  constructor(
    protected studyModel: IStudyModel,
    protected userModel: IUserModel,
    protected notificationModel: INotificationModel,
  ) {}

  // 리팩토링필요
  // 메인 화면에서 스터디 리스트를 조회한다.
  async findStudy(
    offset: number | null,
    limit: number | null,
    sort: string | null,
    language: string | null,
    period: number | null,
    isClosed: string | null,
  ) {
    const studies = await this.studyModel.findStudy(offset, limit, sort, language, period, isClosed);
    const sortStudies = this.sortLanguageByQueryParam(studies, language);
    return sortStudies;
  }

  // 선택한 언어가 리스트의 앞에 오도록 정렬
  async sortLanguageByQueryParam(studies: IStudyDocument[], language: string | null) {
    if (typeof language !== 'string') return studies;

    const paramLanguage = language.split(',');
    for (let i = 0; i < studies.length; i += 1) {
      studies[i].language.sort(function (a, b) {
        if (paramLanguage.indexOf(b) !== -1) return 1;
        return -1;
      });
    }
    return studies;
  }

  // 메인 화면에서 스터디를 추천한다.
  // 4건 이하일 경우 무조건 다시 조회가 아니라, 해당 되는 건은 포함하고 나머지 건만 조회해야한다.
  async recommendToUserFromMain(userId: Types.ObjectId) {
    let sort;
    let likeLanguages = null;
    const limit = 20;
    if (userId) {
      const user = await this.userModel.findById(userId);
      if (user !== null) likeLanguages = user.likeLanguages;
      sort = 'views';
    } else {
      sort = 'totalLikes';
    }

    const studies = await this.studyModel.findStudyRecommend('-views', likeLanguages, null, null, limit);
    return studies;
  }

  // 글에서 스터디를 추천한다.
  // 4건 이하일 경우 무조건 다시 조회가 아니라, 해당 되는 건은 포함하고 나머지 건만 조회해야함
  async recommendToUserFromStudy(studyId: Types.ObjectId, userId: Types.ObjectId) {
    const sort = '-views';
    let language = null;
    const limit = 10;
    if (studyId) {
      const study = await this.studyModel.findById(studyId);
      if (study === null) throw new CustomError('JsonWebTokenError', 404, 'Study not found');

      language = study.language;
    }

    const studies = await this.studyModel.findStudyRecommend(sort, language, studyId, userId, limit);
    return studies;
  }

  // 조회수 증가
  async increaseView(studyId: Types.ObjectId, userId: Types.ObjectId, readList: string) {
    let isAlreadyRead = true;
    let updateReadList = readList;

    // 조회수 중복 증가 방지
    if (readList === undefined || (typeof readList === 'string' && readList.indexOf(studyId.toString()) === -1)) {
      await this.studyModel.increaseView(studyId); // 조회수 증가
      if (userId) await this.userModel.addReadList(studyId, userId); // 읽은 목록 추가
      if (readList === undefined) updateReadList = `${studyId}`;
      else updateReadList = `${readList}|${studyId}`;
      isAlreadyRead = false;
    }
    return { updateReadList, isAlreadyRead };
  }

  // 상세 스터디 정보를 조회한다.
  // 로그인된 사용자일 경우 읽은 목록을 추가한다.
  async findStudyDetail(studyId: Types.ObjectId, userId: Types.ObjectId) {
    const studies = await this.studyModel
      .findById(studyId)
      .populate('author', 'nickName image')
      .populate('comments.author', 'nickName image');
    return studies;
  }

  // 알림을 읽음 표시하고 상세 스터디 정보를 조회한다.
  async findStudyDetailAndUpdateReadAt(studyId: Types.ObjectId, userId: Types.ObjectId) {
    if (userId) {
      await this.notificationModel.updateReadAt(studyId, userId);
    }
    const result = await this.findStudyDetail(studyId, userId);
    return result;
  }

  // 사용자의 관심 등록 여부를 조회한다.
  async findUserLiked(studyId: Types.ObjectId, userId: Types.ObjectId) {
    if (userId && studyId) {
      const studies = await this.studyModel.find({ _id: studyId, likes: userId });
      const isLiked = studies.length > 0;
      return isLiked;
    }
    return false;
  }

  // 스터디의 관심 등록한 사용자 리스트를 조회한다.
  async findLikeUsers(studyId: Types.ObjectId) {
    const likeUsers = await this.studyModel.findById(studyId).select('likes');
    if (!likeUsers) return [];
    return likeUsers.likes;
  }

  // 신규 스터디를 등록한다.
  async registerStudy(userID: Types.ObjectId, study: IStudyDocument) {
    study.author = userID;
    if (study.content) {
      const cleanHTML = sanitizeHtml(study.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      });
      study.content = cleanHTML;
    }
    const studyRecord = await this.studyModel.create(study);
    return studyRecord;
  }

  // 스터디 정보를 수정한다.
  async modifyStudy(id: Types.ObjectId, tokenUserId: Types.ObjectId, study: IStudy) {
    await this.studyModel.checkStudyAuthorization(id, tokenUserId); // 접근 권한 체크
    if (study.content) {
      const cleanHTML = sanitizeHtml(study.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      });
      study.content = cleanHTML;
    }
    const studyRecord = await this.studyModel.modifyStudy(id, study);
    return studyRecord;
  }

  // 스터디를 삭제한다.
  async deleteStudy(id: Types.ObjectId, tokenUserId: Types.ObjectId) {
    await this.studyModel.checkStudyAuthorization(id, tokenUserId); // 접근 권한 체크
    await this.studyModel.deleteStudy(id);
    await this.notificationModel.deleteNotificationByStudy(id); // 글 삭제 시 관련 알림 제거
  }

  // 관심 등록 추가
  async addLike(studyId: Types.ObjectId, userId: Types.ObjectId) {
    const { study, isLikeExist } = await this.studyModel.addLike(studyId, userId);
    if (!isLikeExist) {
      await this.userModel.addLikeStudy(studyId, userId);
      // await this.notificationModel.registerNotification(studyId, study.author, userId, 'like');   // 알림 등록
    }
    return study;
  }

  // 관심 등록 취소(삭제)
  async deleteLike(studyId: Types.ObjectId, userId: Types.ObjectId) {
    const { study, isLikeExist } = await this.studyModel.deleteLike(studyId, userId);
    if (isLikeExist) {
      await this.userModel.deleteLikeStudy(studyId, userId);
      // await this.notificationModel.deleteNotification(studyId, study.author, userId, 'like');   // 알림 삭제
    }
    return study;
  }
}
