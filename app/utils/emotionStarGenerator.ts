import { EmotionStar } from '../page'

// 감정별 별 생성 규칙
const emotionStarRules = {
  '기쁨': {
    shapes: ['star', 'heart', 'circle'] as const,
    colors: ['#FFD700', '#FFA500', '#FF69B4', '#FFFF00'],
    patterns: ['sparkle', 'gradient', 'pulse'] as const,
    defaultGlow: true,
    sizeWeights: { small: 0.2, medium: 0.5, large: 0.3 }
  },
  '슬픔': {
    shapes: ['circle', 'diamond', 'triangle'] as const,
    colors: ['#4169E1', '#6495ED', '#87CEEB', '#B0C4DE'],
    patterns: ['solid', 'gradient'] as const,
    defaultGlow: false,
    sizeWeights: { small: 0.4, medium: 0.4, large: 0.2 }
  },
  '화남': {
    shapes: ['triangle', 'diamond', 'star'] as const,
    colors: ['#FF4500', '#DC143C', '#B22222', '#FF6347'],
    patterns: ['pulse', 'solid', 'sparkle'] as const,
    defaultGlow: true,
    sizeWeights: { small: 0.3, medium: 0.4, large: 0.3 }
  },
  '불안': {
    shapes: ['triangle', 'diamond', 'circle'] as const,
    colors: ['#9370DB', '#8A2BE2', '#9932CC', '#BA55D3'],
    patterns: ['pulse', 'gradient'] as const,
    defaultGlow: false,
    sizeWeights: { small: 0.5, medium: 0.3, large: 0.2 }
  },
  '평온': {
    shapes: ['circle', 'heart', 'star'] as const,
    colors: ['#32CD32', '#98FB98', '#90EE90', '#00FA9A'],
    patterns: ['solid', 'gradient'] as const,
    defaultGlow: false,
    sizeWeights: { small: 0.3, medium: 0.5, large: 0.2 }
  },
  '흥분': {
    shapes: ['star', 'diamond', 'heart'] as const,
    colors: ['#FF8C00', '#FF4500', '#FF1493', '#FF69B4'],
    patterns: ['sparkle', 'pulse', 'gradient'] as const,
    defaultGlow: true,
    sizeWeights: { small: 0.2, medium: 0.4, large: 0.4 }
  }
}

// 텍스트 분석을 통한 감정 강도 계산
function calculateEmotionIntensity(content: string, emotion: string): number {
  const intensityKeywords = {
    high: ['정말', '너무', '엄청', '완전', '진짜', '매우', '굉장히', '극도로', '최고', '최악'],
    medium: ['조금', '약간', '살짝', '어느 정도', '그럭저럭', '보통'],
    low: ['별로', '그냥', '평범', '무난']
  }
  
  const lowerContent = content.toLowerCase()
  let intensity = 3 // 기본값
  
  // 강도 키워드 분석
  const highCount = intensityKeywords.high.filter(word => lowerContent.includes(word)).length
  const mediumCount = intensityKeywords.medium.filter(word => lowerContent.includes(word)).length
  const lowCount = intensityKeywords.low.filter(word => lowerContent.includes(word)).length
  
  if (highCount > 0) intensity = Math.min(5, intensity + highCount)
  if (lowCount > 0) intensity = Math.max(1, intensity - lowCount)
  if (mediumCount > 0 && highCount === 0 && lowCount === 0) intensity = 3
  
  // 텍스트 길이도 고려 (긴 글일수록 감정이 강할 가능성)
  const contentLength = content.length
  if (contentLength > 200) intensity = Math.min(5, intensity + 1)
  else if (contentLength < 50) intensity = Math.max(1, intensity - 1)
  
  return Math.max(1, Math.min(5, intensity))
}

// 가중치 기반 랜덤 선택
function weightedRandomChoice<T>(options: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  let random = Math.random() * totalWeight
  
  for (let i = 0; i < options.length; i++) {
    random -= weights[i]
    if (random <= 0) return options[i]
  }
  
  return options[options.length - 1]
}

// 크기 선택 (가중치 기반)
function selectSize(sizeWeights: { small: number, medium: number, large: number }): 'small' | 'medium' | 'large' {
  const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large']
  const weights = [sizeWeights.small, sizeWeights.medium, sizeWeights.large]
  return weightedRandomChoice(sizes, weights)
}

// EmotionStar 생성 함수
export function generateEmotionStar(
  emotion: string,
  content: string,
  diaryId: string
): EmotionStar {
  const rules = emotionStarRules[emotion as keyof typeof emotionStarRules]
  
  if (!rules) {
    // 기본 별 생성
    return {
      id: `star-${Date.now()}`,
      emotion,
      intensity: 3,
      shape: 'star',
      size: 'medium',
      color: '#FFD700',
      glow: false,
      pattern: 'solid',
      createdAt: new Date().toISOString(),
      diaryId
    }
  }
  
  const intensity = calculateEmotionIntensity(content, emotion)
  const shape = rules.shapes[Math.floor(Math.random() * rules.shapes.length)]
  const color = rules.colors[Math.floor(Math.random() * rules.colors.length)]
  const pattern = rules.patterns[Math.floor(Math.random() * rules.patterns.length)]
  const size = selectSize(rules.sizeWeights)
  
  // 강도에 따른 글로우 효과 조정
  const glow = rules.defaultGlow || intensity >= 4
  
  return {
    id: `star-${Date.now()}`,
    emotion,
    intensity,
    shape,
    size,
    color,
    glow,
    pattern,
    createdAt: new Date().toISOString(),
    diaryId
  }
}

// 별 컬렉션 관리
export function getStarCollection(diaries: any[]): EmotionStar[] {
  return diaries
    .filter(diary => diary.emotionStar)
    .map(diary => diary.emotionStar)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// 감정별 별 통계
export function getStarStatsByEmotion(stars: EmotionStar[]) {
  const stats = stars.reduce((acc, star) => {
    if (!acc[star.emotion]) {
      acc[star.emotion] = {
        count: 0,
        avgIntensity: 0,
        shapes: {} as Record<string, number>,
        colors: {} as Record<string, number>
      }
    }
    
    acc[star.emotion].count++
    acc[star.emotion].avgIntensity += star.intensity
    acc[star.emotion].shapes[star.shape] = (acc[star.emotion].shapes[star.shape] || 0) + 1
    acc[star.emotion].colors[star.color] = (acc[star.emotion].colors[star.color] || 0) + 1
    
    return acc
  }, {} as Record<string, any>)
  
  // 평균 강도 계산
  Object.keys(stats).forEach(emotion => {
    stats[emotion].avgIntensity = stats[emotion].avgIntensity / stats[emotion].count
  })
  
  return stats
}