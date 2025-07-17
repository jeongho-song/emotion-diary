'use client'

import { useState } from 'react'
import { Diary } from '../page'

interface DiaryEntryProps {
  onSave: (diary: Omit<Diary, 'id'>) => void
}

const emotions = [
  { name: '기쁨', emoji: '😊', color: 'bg-yellow-200 border-yellow-400' },
  { name: '슬픔', emoji: '😢', color: 'bg-blue-200 border-blue-400' },
  { name: '화남', emoji: '😠', color: 'bg-red-200 border-red-400' },
  { name: '불안', emoji: '😰', color: 'bg-purple-200 border-purple-400' },
  { name: '평온', emoji: '😌', color: 'bg-green-200 border-green-400' },
  { name: '흥분', emoji: '🤩', color: 'bg-orange-200 border-orange-400' },
]

export default function DiaryEntry({ onSave }: DiaryEntryProps) {
  const [selectedEmotion, setSelectedEmotion] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmotion || !content.trim()) return

    const emotion = emotions.find(e => e.name === selectedEmotion)
    onSave({
      date: new Date().toISOString().split('T')[0],
      emotion: selectedEmotion,
      content: content.trim(),
      emotionColor: emotion?.color || ''
    })

    setSelectedEmotion('')
    setContent('')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">새 일기 작성</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            오늘의 감정을 선택해주세요
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {emotions.map((emotion) => (
              <button
                key={emotion.name}
                type="button"
                onClick={() => setSelectedEmotion(emotion.name)}
                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedEmotion === emotion.name
                    ? `${emotion.color} border-opacity-100`
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="text-2xl mb-1">{emotion.emoji}</div>
                <div className="text-sm font-medium">{emotion.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            오늘 하루는 어땠나요?
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘의 감정과 경험을 자유롭게 적어보세요..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={6}
            required
          />
        </div>

        <button
          type="submit"
          disabled={!selectedEmotion || !content.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-colors"
        >
          일기 저장하기
        </button>
      </form>
    </div>
  )
}