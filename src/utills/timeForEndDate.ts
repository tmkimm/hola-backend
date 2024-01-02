// 모집 마감일 계산
export function timeForEndDate(endDate: Date): string {
    const today: Date = new Date();
    // 시간을 제외하고 day로만 계산
    if(endDate < today)
        return ``;
    
    const betweenTime: number = Math.floor((endDate.getTime() - today.getTime()) / 1000 / 60);
    const betweenTimeHour = Math.floor(betweenTime / 60);
    if(betweenTimeHour < 24) 
        return `오늘 마감`;
    
    const betweenTimeDay = Math.ceil(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
      return `마감 ${betweenTimeDay}일전`;
    }
    
    return `마감 ${Math.floor(betweenTimeDay / 365)}년전`;
  }