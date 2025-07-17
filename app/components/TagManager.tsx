'use client'

import { useState } from 'react'
import { Diary } from '../page'
import { getPopularTags, searchByTags } from '../utils/tagExtractor'

interface TagManagerProps {
  diaries: Diary[]
  onFilterChange: (filteredDiaries: Diary[]) => void
}

export default function TagManager({ diaries, onFilterChange }: TagManagerProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAllTags, setShowAllTags] = useState(false)

  const popularTags = getPopularTags(diaries, showAllTags ? 50 : 10)
  
  // 검색어로 태그 필터링
  const filteredTags = popularTags.filter(({ tag }) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleTagToggle = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    
    setSelectedTags(newSelectedTags)
    
    // 필터링된 일기 목록 업데이트
    const filteredDiaries = searchByTags(diaries, newSelectedTags)
    onFilterChange(filteredDiaries)
  }

  const clearAllTags = () => {
    setSelectedTags([])
    onFilterChange(diaries)
  }

  const getTagColor = (tag: string): string => {
    // 태그별 색상 매핑
    const colorMap: { [key: string]: string } = {
      '걱정': 'bg-red-100 text-red-800 border-red-200',
      '행복': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      '화남': 'bg-red-100 text-red-800 border-red-200',
      '슬픔': 'bg-blue-100 text-blue-800 border-blue-200',
      '평온': 'bg-green-100 text-green-800 border-green-200',
      '성장': 'bg-purple-100 text-purple-800 border-purple-200',
      '노력': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      '목표': 'bg-pink-100 text-pink-800 border-pink-200',
      '가족': 'bg-orange-100 text-orange-800 border-orange-200',
      '친구': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      '연인': 'bg-rose-100 text-rose-800 border-rose-200',
      '일': 'bg-gray-100 text-gray-800 border-gray-200',
      '공부': 'bg-blue-100 text-blue-800 border-blue-200',
      '운동': 'bg-green-100 text-green-800 border-green-200',
      '여행': 'bg-teal-100 text-teal-800 border-teal-200',
      '취미': 'bg-violet-100 text-violet-800 border-violet-200',
    }
    
    return colorMap[tag] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  if (diaries.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">태그로 일기 찾기</h3>
        {selectedTags.length > 0 && (
          <button
            onClick={clearAllTags}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            전체 해제
          </button>
        )}
      </div>

      {/* 검색 입력 */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="태그 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* 선택된 태그 표시 */}
      {selectedTags.length > 0 && (
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">선택된 태그:</div>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map(tag => (
              <span
                key={tag}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTagColor(tag)}`}
              >
                #{tag}
                <button
                  onClick={() => handleTagToggle(tag)}
                  className="ml-2 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {searchByTags(diaries, selectedTags).length}개의 일기가 찾아졌습니다.
          </div>
        </div>
      )}

      {/* 인기 태그 목록 */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm text-gray-600">인기 태그</div>
          <button
            onClick={() => setShowAllTags(!showAllTags)}
            className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            {showAllTags ? '간단히 보기' : '더 보기'}
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filteredTags.map(({ tag, count }) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border transition-all hover:scale-105 ${
                selectedTags.includes(tag)
                  ? `${getTagColor(tag)} ring-2 ring-indigo-300`
                  : `${getTagColor(tag)} hover:shadow-md`
              }`}
            >
              #{tag}
              <span className="ml-1 text-xs opacity-75">({count})</span>
            </button>
          ))}
        </div>
        
        {filteredTags.length === 0 && searchQuery && (
          <div className="text-center py-4 text-gray-500">
            "{searchQuery}"와 관련된 태그를 찾을 수 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}