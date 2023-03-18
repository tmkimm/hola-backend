import { User as UserModel } from '../models/User';
import { Post as PostModel } from '../models/Post';

import { SignOutUser as SignOutUserModel } from '../models/SignOutUser';
import { PostFilterLog as PostFilterLogModel } from '../models/PostFilterLog';

// 데일리 액션) 현재 총 회원 수, 오늘 가입자, 오늘 탈퇴자
const findDailyUser = async () => {
  const totalUser: number = await UserModel.countDocuments();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const signUp: number = await UserModel.countDocuments({ createdAt: { $gte: today } });
  const signOut: number = await SignOutUserModel.countDocuments({ signOutDate: { $gte: today } });

  return {
    totalUser,
    signUp,
    signOut,
  };
};

// 일자별 회원 가입 현황(일자 / 신규 가입자 / 탈퇴자)
const findUserHistory = async (startDate: string, endDate: string) => {
  const userHistory = await UserModel.aggregate([
    { $match: { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, signIn: { $sum: 1 } } },
    { $addFields: { signOut: 0 } },
    {
      $unionWith: {
        coll: 'signoutusers',
        pipeline: [
          { $match: { signOutDate: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
          { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$signOutDate' } }, signOut: { $sum: 1 } } },
          { $addFields: { signIn: 0 } },
        ],
      },
    },
    { $group: { _id: '$_id', signIn: { $sum: '$signIn' }, signOut: { $sum: '$signOut' } } },
    { $sort: { _id: 1 } },
  ]);
  return userHistory;
};
// 게시글 데일리(오늘 전체 글 조회 수, 등록된 글, 글 마감 수, 글 삭제 수 )
const findDailyPost = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let totalView = 0;
  const totalViewSum = await PostModel.aggregate([
    { $match: { createdAt: { $gte: today } } },
    { $group: { _id: null, totalView: { $sum: '$views' } } },
  ]);
  if (totalViewSum && totalViewSum.length > 0 && totalViewSum[0].totalView) totalView = totalViewSum[0].totalView;

  const created: number = await PostModel.countDocuments({ createdAt: { $gte: today } });
  const closed: number = await PostModel.countDocuments({ closeDate: { $gte: today } });
  const deleted: number = await PostModel.countDocuments({ deleteDate: { $gte: today } });
  return {
    totalView,
    created,
    closed,
    deleted,
  };
};

// 일자별 게시글 현황(일자 / 등록된 글 / 마감된 글 / 삭제된 글)
const findPostHistory = async (startDate: string, endDate: string) => {
  const postHistory = await PostModel.aggregate([
    { $match: { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, created: { $sum: 1 } } },
    {
      $unionWith: {
        coll: 'posts',
        pipeline: [
          { $match: { closeDate: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
          { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$closeDate' } }, closed: { $sum: 1 } } },
        ],
      },
    },
    {
      $unionWith: {
        coll: 'posts',
        pipeline: [
          { $match: { deleteDate: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
          { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$deleteDate' } }, deleted: { $sum: 1 } } },
        ],
      },
    },
    {
      $group: {
        _id: '$_id',
        created: { $sum: '$created' },
        closed: { $sum: '$closed' },
        deleted: { $sum: '$deleted' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  return postHistory;
};

// 가장 많이 조회해 본 언어 필터
const findPostFilterRank = async (startDate: string, endDate: string) => {
  const userHistory = await PostFilterLogModel.aggregate([
    { $match: { viewDate: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
    { $project: { _id: 0, viewDate: 1, language: 1 } },
    { $unwind: '$language' },
    { $group: { _id: '$language', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  return userHistory;
};

export { findDailyUser, findUserHistory, findDailyPost, findPostHistory, findPostFilterRank };
