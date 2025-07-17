'use client'

import { useState, useEffect } from 'react'
import DiaryEntry from './components/DiaryEntry'
import DiaryList from './components/DiaryList'
import EmotionStats from './components/EmotionStats'
import DailyFeedback from './components/DailyFeedback'
import TagManager from './components/TagManager'
import StarCollection from './components/StarCollection'
import { generateEmotionStar } from './utils/emotionStarGenerator'

export interface EmotionStar {
  id: string
  emotion: string
  intensity: number // 1-5 (감정 강도)
  shape: 'star' | 'heart' | 'diamond' | 'circle' | 'triangle'
  size: 'small' | 'medium' | 'large'
  color: string
  glow: boolean
  pattern: 'solid' | 'gradient' | 'sparkle' | 'pulse'
  createdAt: string
  diaryId: string
}

export interface Diary {
  id: string
  date: string
  emotion: string
  content: string
  emotionColor: string
  tags: string[]
  autoTags: string[]
  emotionStar?: EmotionStar
}

export default function Home() {
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [filteredDiaries, setFilteredDiaries] = useState<Diary[]>([])
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'diary' | 'stats' | 'stars'>('diary')

  useEffect(() => {
    const saved = localStorage.getItem('emotion-diaries')
    if (saved) {
      const loadedDiaries = JSON.parse(saved)
      setDiaries(loadedDiaries)
      setFilteredDiaries(loadedDiaries)
    }
  }, [])

  // 일기 목록이 변경될 때 필터링된 목록도 업데이트
  useEffect(() => {
    setFilteredDiaries(diaries)
  }, [diaries])

  const saveDiary = (diary: Omit<Diary, 'id'>) => {
    const diaryId = Date.now().toString()
    
    // EmotionStar 생성
    const emotionStar = generateEmotionStar(diary.emotion, diary.content, diaryId)
    
    const newDiary = {
      ...diary,
      id: diaryId,
      emotionStar
    }
    const updated = [newDiary, ...diaries]
    setDiaries(updated)
    localStorage.setItem('emotion-diaries', JSON.stringify(updated))
    setShowForm(false)
  }

  const deleteDiary = (id: string) => {
    const updated = diaries.filter(d => d.id !== id)
    setDiaries(updated)
    localStorage.setItem('emotion-diaries', JSON.stringify(updated))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">감정 일기</h1>
        <p className="text-gray-600">오늘의 감정을 기록해보세요</p>
      </header>

      {/* 탭 네비게이션 */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-4">
          <button
            onClick={() => {
              setActiveTab('diary')
              setShowForm(false)
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'diary'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📝 일기 작성
          </button>
          <button
            onClick={() => {
              setActiveTab('stats')
              setShowForm(false)
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'stats'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            📊 감정 통계
          </button>
          <button
            onClick={() => {
              setActiveTab('stars')
              setShowForm(false)
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'stars'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            ⭐ 감정 별
          </button>
        </div>

        {activeTab === 'diary' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {showForm ? '취소' : '새 일기 쓰기'}
          </button>
        )}
      </div>

      {/* 컨텐츠 영역 */}
      {activeTab === 'diary' && (
        <>
          {/* 일일 피드백 */}
          <DailyFeedback diaries={diaries} />
          
          {showForm && (
            <div className="mb-8">
              <DiaryEntry onSave={saveDiary} />
            </div>
          )}
          
          {/* 태그 관리자 */}
          <TagManager 
            diaries={diaries} 
            onFilterChange={setFilteredDiaries}
          />
          
          <DiaryList diaries={filteredDiaries} onDelete={deleteDiary} />
        </>
      )}

      {activeTab === 'stats' && (
        <EmotionStats diaries={diaries} />
      )}

      {activeTab === 'stars' && (
        <StarCollection diaries={diaries} />
      )}
    </div>
  )
}