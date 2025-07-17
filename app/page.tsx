'use client'

import { useState, useEffect } from 'react'
import DiaryEntry from './components/DiaryEntry'
import DiaryList from './components/DiaryList'
import EmotionStats from './components/EmotionStats'

export interface Diary {
  id: string
  date: string
  emotion: string
  content: string
  emotionColor: string
}

export default function Home() {
  const [diaries, setDiaries] = useState<Diary[]>([])
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'diary' | 'stats'>('diary')

  useEffect(() => {
    const saved = localStorage.getItem('emotion-diaries')
    if (saved) {
      setDiaries(JSON.parse(saved))
    }
  }, [])

  const saveDiary = (diary: Omit<Diary, 'id'>) => {
    const newDiary = {
      ...diary,
      id: Date.now().toString()
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
          {showForm && (
            <div className="mb-8">
              <DiaryEntry onSave={saveDiary} />
            </div>
          )}
          <DiaryList diaries={diaries} onDelete={deleteDiary} />
        </>
      )}

      {activeTab === 'stats' && (
        <EmotionStats diaries={diaries} />
      )}
    </div>
  )
}