'use client'

import { useState } from 'react'
import { Diary, EmotionStar } from '../page'
import { getStarCollection, getStarStatsByEmotion } from '../utils/emotionStarGenerator'
import EmotionStarDisplay from './EmotionStarDisplay'

interface StarCollectionProps {
  diaries: Diary[]
}

export default function StarCollection({ diaries }: StarCollectionProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'constellation'>('grid')
  
  const stars = getStarCollection(diaries)
  const stats = getStarStatsByEmotion(stars)
  
  // 감정별 필터링
  const filteredStars = selectedEmotion === 'all' 
    ? stars 
    : stars.filter(star => star.emotion === selectedEmotion)
  
  const emotions = ['all', ...Object.keys(stats)]
  
  if (stars.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">별 컬렉션이 비어있습니다</h3>
          <p className="text-gray-500">일기를 작성하면 감정별로 특별한 별이 생성됩니다!</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">감정 별 컬렉션</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'constellation' : 'grid')}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {viewMode === 'grid' ? '🌌 별자리 보기' : '📋 격자 보기'}
          </button>
        </div>
      </div>
      
      {/* 통계 요약 */}
      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-indigo-600">{stars.length}</div>
            <div className="text-sm text-gray-600">총 별 개수</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{Object.keys(stats).length}</div>
            <div className="text-sm text-gray-600">감정 종류</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-600">
              {Math.round(stars.reduce((sum, star) => sum + star.intensity, 0) / stars.length * 10) / 10}
            </div>
            <div className="text-sm text-gray-600">평균 강도</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {stars.filter(star => star.glow).length}
            </div>
            <div className="text-sm text-gray-600">빛나는 별</div>
          </div>
        </div>
      </div>
      
      {/* 감정 필터 */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {emotions.map(emotion => (
            <button
              key={emotion}
              onClick={() => setSelectedEmotion(emotion)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedEmotion === emotion
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {emotion === 'all' ? '전체' : emotion}
              {emotion !== 'all' && (
                <span className="ml-1 text-xs opacity-75">
                  ({stats[emotion]?.count || 0})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* 별 표시 영역 */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 p-4 bg-gray-50 rounded-lg min-h-[200px]">
          {filteredStars.map((star, index) => (
            <div
              key={star.id}
              className="flex justify-center items-center"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: 'fadeInUp 0.5s ease-out forwards'
              }}
            >
              <EmotionStarDisplay 
                star={star} 
                size="lg" 
                showDetails={true}
              />
            </div>
          ))}
        </div>
      ) : (
        <div 
          className="relative bg-gradient-to-b from-indigo-900 to-purple-900 rounded-lg p-8 min-h-[400px] overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)`
          }}
        >
          {filteredStars.map((star, index) => {
            // 별자리처럼 랜덤 위치 배치
            const x = Math.random() * 80 + 10 // 10-90%
            const y = Math.random() * 80 + 10 // 10-90%
            
            return (
              <div
                key={star.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  animationDelay: `${index * 0.2}s`,
                  animation: 'twinkle 3s ease-in-out infinite'
                }}
              >
                <EmotionStarDisplay 
                  star={star} 
                  size="md" 
                  showDetails={false}
                />
              </div>
            )
          })}
          
          {/* 별자리 연결선 (장식용) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
            {filteredStars.slice(0, -1).map((_, index) => {
              if (index % 3 === 0 && index < filteredStars.length - 1) {
                const x1 = Math.random() * 80 + 10
                const y1 = Math.random() * 80 + 10
                const x2 = Math.random() * 80 + 10
                const y2 = Math.random() * 80 + 10
                
                return (
                  <line
                    key={index}
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                )
              }
              return null
            })}
          </svg>
        </div>
      )}
      
      {filteredStars.length === 0 && selectedEmotion !== 'all' && (
        <div className="text-center py-8 text-gray-500">
          {selectedEmotion} 감정의 별이 아직 없습니다.
        </div>
      )}
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}