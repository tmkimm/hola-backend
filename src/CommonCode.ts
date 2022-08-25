import { DevOpsGuru } from 'aws-sdk';

interface CommonCodeType {
  [key: string]: string;
}

const studyOrProjectCode: CommonCodeType = {
  '1': '프로젝트',
  '2': '스터디',
};

const onlineOrOfflineCode: CommonCodeType = {
  on: '온라인',
  off: '오프라인',
};

const recruitsCode: CommonCodeType = {
  und: '인원 미정',
  '1': '1명',
  '2': '2명',
  '3': '3명',
  '4': '4명',
  '5': '5명',
  '6': '6명',
  '7': '7명',
  '8': '8명',
  '9': '9명',
  mo: '10명 이상',
};

const contactTypeCode: CommonCodeType = {
  ok: '오픈 카카오톡',
  pk: '개인 카카오톡',
  em: '이메일',
  gf: '구글폼',
};

const PositionsCode: CommonCodeType = {
  frdev: '프론트엔드 개발',
  badev: '서버 개발',
  iosdev: 'ios 개발',
  anddev: '안드로이드 개발',
  devops: 'DevOps',
  prdi: '프로덕트 디자인',
  uidi: 'UI/UX 디자인',
};

const expectedPeriodCode: CommonCodeType = {
  und: '기간 미정',
  '1': '1개월',
  '2': '2개월',
  '3': '3개월',
  '4': '4개월',
  '5': '5개월',
  '6': '6개월',
  mo: '장기',
};

export { studyOrProjectCode, onlineOrOfflineCode, recruitsCode, contactTypeCode, expectedPeriodCode };
