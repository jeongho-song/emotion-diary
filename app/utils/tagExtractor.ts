// 자동 태그 추출 시스템
export interface TagCategory {
  category: string
  keywords: string[]
  tag: string
}

// 감정 및 상황별 키워드 매핑
const tagCategories: TagCategory[] = [
  // 감정 관련
  { category: '감정', keywords: ['걱정', '불안', '스트레스', '우울', '답답'], tag: '걱정' },
  { category: '감정', keywords: ['행복', '기쁨', '즐거움', '신남', '만족'], tag: '행복' },
  { category: '감정', keywords: ['화남', '짜증', '분노', '열받', '속상'], tag: '화남' },
  { category: '감정', keywords: ['슬픔', '우울', '눈물', '아픔', '상처'], tag: '슬픔' },
  { category: '감정', keywords: ['평온', '차분', '안정', '고요', '평화'], tag: '평온' },
  
  // 성장 관련
  { category: '성장', keywords: ['성장', '발전', '배움', '깨달음', '변화', '도전'], tag: '성장' },
  { category: '성장', keywords: ['노력', '열심히', '공부', '연습', '개선'], tag: '노력' },
  { category: '성장', keywords: ['목표', '계획', '꿈', '비전', '희망'], tag: '목표' },
  
  // 관계 관련
  { category: '관계', keywords: ['가족', '부모', '형제', '자매'], tag: '가족' },
  { category: '관계', keywords: ['친구', '동료', '선배', '후배'], tag: '친구' },
  { category: '관계', keywords: ['연인', '남친', '여친', '사랑'], tag: '연인' },
  { category: '관계', keywords: ['갈등', '다툼', '싸움', '오해'], tag: '갈등' },
  
  // 활동 관련
  { category: '활동', keywords: ['일', '업무', '회사', '직장', '프로젝트'], tag: '일' },
  { category: '활동', keywords: ['공부', '학습', '시험', '과제'], tag: '공부' },
  { category: '활동', keywords: ['운동', '헬스', '조깅', '요가', '산책'], tag: '운동' },
  { category: '활동', keywords: ['여행', '휴가', '나들이', '외출'], tag: '여행' },
  { category: '활동', keywords: ['취미', '독서', '영화', '음악', '게임'], tag: '취미' },
  
  // 건강 관련
  { category: '건강', keywords: ['피곤', '졸림', '잠', '수면'], tag: '피로' },
  { category: '건강', keywords: ['아픔', '병', '감기', '두통'], tag: '건강' },
  { category: '건강', keywords: ['다이어트', '살', '체중', '식단'], tag: '다이어트' },
  
  // 시간 관련
  { category: '시간', keywords: ['아침', '새벽', '오전'], tag: '아침' },
  { category: '시간', keywords: ['점심', '오후', '낮'], tag: '오후' },
  { category: '시간', keywords: ['저녁', '밤', '야간'], tag: '저녁' },
  { category: '시간', keywords: ['주말', '토요일', '일요일'], tag: '주말' },
  
  // 날씨/계절 관련
  { category: '날씨', keywords: ['비', '비오는', '장마'], tag: '비' },
  { category: '날씨', keywords: ['눈', '겨울', '추위'], tag: '겨울' },
  { category: '날씨', keywords: ['더위', '여름', '덥다'], tag: '여름' },
  { category: '날씨', keywords: ['봄', '꽃', '따뜻'], tag: '봄' },
]

// 해시태그 추출 (#태그 형태)
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#([가-힣a-zA-Z0-9_]+)/g
  const matches = text.match(hashtagRegex)
  return matches ? matches.map(tag => tag.substring(1)) : []
}

// 자동 태그 추출 (키워드 기반)
export function extractAutoTags(text: string): string[] {
  const foundTags = new Set<string>()
  const lowerText = text.toLowerCase()
  
  tagCategories.forEach(({ keywords, tag }) => {
    const hasKeyword = keywords.some(keyword => 
      lowerText.includes(keyword.toLowerCase())
    )
    if (hasKeyword) {
      foundTags.add(tag)
    }
  })
  
  return Array.from(foundTags)
}

// 모든 태그 추출 (해시태그 + 자동태그)
export function extractAllTags(text: string): { hashtags: string[], autoTags: string[] } {
  const hashtags = extractHashtags(text)
  const autoTags = extractAutoTags(text)
  
  return { hashtags, autoTags }
}

// 태그 검색 기능
export function searchByTags(diaries: any[], searchTags: string[]): any[] {
  if (searchTags.length === 0) return diaries
  
  return diaries.filter(diary => {
    const allDiaryTags = [...(diary.tags || []), ...(diary.autoTags || [])]
    return searchTags.some(searchTag => 
      allDiaryTags.some(diaryTag => 
        diaryTag.toLowerCase().includes(searchTag.toLowerCase())
      )
    )
  })
}

// 인기 태그 추출
export function getPopularTags(diaries: any[], limit: number = 10): { tag: string, count: number }[] {
  const tagCounts = new Map<string, number>()
  
  diaries.forEach(diary => {
    const allTags = [...(diary.tags || []), ...(diary.autoTags || [])]
    allTags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    })
  })
  
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}