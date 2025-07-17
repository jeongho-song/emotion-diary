'use client'

import { EmotionStar } from '../page'

interface EmotionStarDisplayProps {
  star: EmotionStar
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showDetails?: boolean
}

export default function EmotionStarDisplay({ 
  star, 
  size = 'md', 
  showDetails = false 
}: EmotionStarDisplayProps) {
  
  // 크기 매핑
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  
  const actualSize = star.size === 'small' ? 'sm' : 
                   star.size === 'medium' ? 'md' : 'lg'
  const displaySize = size || actualSize
  
  // 글로우 효과 스타일
  const glowStyle = star.glow ? {
    filter: `drop-shadow(0 0 8px ${star.color}40)`,
    animation: star.pattern === 'pulse' ? 'pulse 2s infinite' : undefined
  } : {}
  
  // 패턴별 스타일
  const getPatternStyle = () => {
    switch (star.pattern) {
      case 'gradient':
        return {
          background: `linear-gradient(45deg, ${star.color}, ${star.color}80)`,
          ...glowStyle
        }
      case 'sparkle':
        return {
          background: star.color,
          animation: 'sparkle 1.5s ease-in-out infinite alternate',
          ...glowStyle
        }
      case 'pulse':
        return {
          background: star.color,
          animation: 'pulse 2s infinite',
          ...glowStyle
        }
      default:
        return {
          background: star.color,
          ...glowStyle
        }
    }
  }
  
  // 모양별 SVG 패스
  const getShapePath = () => {
    switch (star.shape) {
      case 'star':
        return "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      case 'heart':
        return "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      case 'diamond':
        return "M12 2l4 6-4 6-4-6 4-6z M12 8l6 4-6 4-6-4 6-4z"
      case 'circle':
        return "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
      case 'triangle':
        return "M12 2l10 18H2L12 2z"
      default:
        return "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    }
  }
  
  return (
    <div className="inline-flex flex-col items-center">
      <div 
        className={`${sizeClasses[displaySize]} relative transition-all duration-300 hover:scale-110`}
        style={getPatternStyle()}
        title={showDetails ? `${star.emotion} - 강도: ${star.intensity}` : star.emotion}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full"
          fill="currentColor"
        >
          <path d={getShapePath()} />
        </svg>
        
        {/* 강도 표시 (작은 점들) */}
        {showDetails && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`w-1 h-1 rounded-full ${
                  i < star.intensity ? 'bg-current opacity-80' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      
      {showDetails && (
        <div className="mt-1 text-xs text-center text-gray-600">
          <div className="font-medium">{star.emotion}</div>
          <div className="text-gray-500">강도 {star.intensity}</div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes sparkle {
          0% { opacity: 0.7; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}