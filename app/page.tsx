'use client'

import { useState, useEffect } from 'react'
import DiaryEntry from './components/DiaryEntry'
import DiaryList from './components/DiaryList'

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

      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {showForm ? '취소' : '새 일기 쓰기'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8">
          <DiaryEntry onSave={saveDiary} />
        </div>
      )}

      <DiaryList diaries={diaries} onDelete={deleteDiary} />
    </div>
  )
}