'use client'

import { Diary } from '../page'

interface DiaryListProps {
  diaries: Diary[]
  onDelete: (id: string) => void
}

const emotionEmojis: { [key: string]: string } = {
  '기쁨': '😊',
  '슬픔': '😢',
  '화남': '😠',
  '불안': '😰',
  '평온': '😌',
  '흥분': '🤩',
}

export default function DiaryList({ diaries, onDelete }: DiaryListProps) {
  if (diaries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">아직 작성된 일기가 없습니다</h3>
        <p className="text-gray-500">첫 번째 감정 일기를 작성해보세요!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">나의 감정 일기</h2>

      {diaries.map((diary) => (
        <div
          key={diary.id}
          className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${diary.emotionColor.replace('bg-', 'border-').replace('-200', '-400')}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{emotionEmojis[diary.emotion]}</span>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{diary.emotion}</h3>
                <p className="text-sm text-gray-500">{diary.date}</p>
              </div>
            </div>
            <button
              onClick={() => onDelete(diary.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
              title="일기 삭제"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{diary.content}</p>
          </div>

          {/* 태그 표시 */}
          {((diary.tags && diary.tags.length > 0) || (diary.autoTags && diary.autoTags.length > 0)) && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-2">
                {/* 해시태그 (사용자가 직접 입력) */}
                {diary.tags?.map(tag => (
                  <span
                    key={`hash-${tag}`}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200"
                  >
                    <span className="mr-1">🏷️</span>
                    #{tag}
                  </span>
                ))}
                
                {/* 자동 태그 (AI가 추출) */}
                {diary.autoTags?.map(tag => (
                  <span
                    key={`auto-${tag}`}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"
                  >
                    <span className="mr-1">🤖</span>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}