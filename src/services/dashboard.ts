import { User } from '../models/User';
import { SignOutUser } from '../models/SignOutUser';
import { PostFilterLog } from '../models/PostFilterLog';

export class DashboardService {
  // 데일리 액션) 현재 총 회원 수, 오늘 가입자, 오늘 탈퇴자
  async findDailyUser() {
    const totalUser: number = await User.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const signUpCount: number = await User.countDocuments({ createdAt: { $gte: today } });
    const signOutCount: number = await SignOutUser.countDocuments({ signOutDate: { $gte: today } });

    return {
      totalUser,
      signUpCount,
      signOutCount,
    };
  }

  // 일자별 회원 가입 현황(일자 / 신규 가입자 / 탈퇴자)
  async findUserHistory() {
    const today = new Date('09/01/2022');

    const userHistory = await User.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, signIn: { $sum: 1 } } },
      { $addFields: { signOut: 0 } },
      {
        $unionWith: {
          coll: 'signoutusers',
          pipeline: [
            { $match: { signOutDate: { $gte: today } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$signOutDate' } }, signOut: { $sum: 1 } } },
            { $addFields: { signIn: 0 } },
          ],
        },
      },
      { $group: { _id: '$_id', signIn: { $sum: '$signIn' }, signOut: { $sum: '$signOut' } } },
      { $sort: { _id: 1 } },
    ]);
    return userHistory;
  }

  // { $project : { _id: 0, viewDate: 1, language: 1}},
  // { $unwind : "$language"},
  // { $group: { _id: "$language", cnt: { $sum : 1}}},
  // { $sort : {cnt: 1}}

  // 가장 많이 조회해 본 언어 필터
  async findPostFilterRank() {
    const today = new Date('09/01/2022');

    const userHistory = await PostFilterLog.aggregate([
      { $match: { viewDate: { $gte: today } } },
      { $project: { _id: 0, viewDate: 1, language: 1 } },
      { $unwind: '$language' },
      { $group: { _id: '$language', cnt: { $sum: 1 } } },
      { $sort: { cnt: 1 } },
    ]);
    return userHistory;
  }
}
