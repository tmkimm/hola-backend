interface CommonCodeType {
  [key: string]: string;
}

// 모집 글 종류
const studyOrProjectCode: CommonCodeType = {
  '1': '프로젝트',
  '2': '스터디',
};

// 온, 오프라인 구분
const onlineOrOfflineCode: CommonCodeType = {
  on: '온라인',
  off: '오프라인',
  onOff: '온/오프라인',
};

// 모집인원
const recruitsCode: CommonCodeType = {
  'und': '인원 미정',
  '1': '1명',
  '2': '2명',
  '3': '3명',
  '4': '4명',
  '5': '5명',
  '6': '6명',
  '7': '7명',
  '8': '8명',
  '9': '9명',
  'mo': '10명 이상',
};

// 연락방법
const contactTypeCode: CommonCodeType = {
  ok: '오픈 카카오톡',
  pk: '개인 카카오톡',
  em: '이메일',
  gf: '구글폼',
};

// 예상진행기간
const expectedPeriodCode: CommonCodeType = {
  'und': '기간 미정',
  '1': '1개월',
  '2': '2개월',
  '3': '3개월',
  '4': '4개월',
  '5': '5개월',
  '6': '6개월',
  'mo': '장기',
};

// 포지션
const positionsCode: string[] = ['ALL', 'FE', 'BE', 'DE', 'IOS', 'AND', 'DEVOPS', 'PM', 'PD'];

// 경력
const workExperienceCode: CommonCodeType = {
  0: '0년',
  '1': '1년',
  '2': '2년',
  '3': '3년',
  '4': '4년',
  '5': '5년',
  '6': '6년',
  '7': '7년',
  '8': '8년',
  '9': '9년',
  '10': '10년 이상',
};

// URL Type
const urlType: string[] = [
  'Link',
  'Behance',
  'Brunch',
  'Dribble',
  'Facebook',
  'GitHub',
  'Instargram',
  'LinkedIn',
  'Naverblog',
  'Notefolio',
  'Notion',
  'Pinterest',
  'Youtube',
  'Twitter',
  'Tistory',
  'Velog',
];

export { contactTypeCode, expectedPeriodCode, onlineOrOfflineCode, recruitsCode, studyOrProjectCode };
