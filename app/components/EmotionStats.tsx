'use client'

import { Diary } from '../page'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { useState } from 'react'

interface EmotionStatsProps {
  diaries: Diary[]
}

const emotionColors = {
  '기쁨': '#FDE047',
  '슬픔': '#60A5FA', 
  '화남': '#F87171',
  '불안': '#C084FC',
  '평온': '#4ADE80',
  '흥분': '#FB923C'
}

const emotionEmojis = {
  '기쁨': '😊',
  '슬픔': '😢',
  '화남': '😠',
  '불안': '😰',
  '평온': '😌',
  '흥분': '🤩'
}

export default function EmotionStats({ diaries }: EmotionStatsProps) {
  const [activeChart, setActiveChart] = useState<'bar' | 'line' | 'pie'>('bar')

  if (diaries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">감정 통계</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-500">일기를 작성하면 감정 통계를 확인할 수 있습니다</p>
        </div>
      </div>
    )
  }

  // 감정별 카운트 계산
  const emotionCounts = diaries.reduce((acc, diary) => {
    acc[diary.emotion] = (acc[diary.emotion] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // 바 차트용 데이터
  const barData = Object.entries(emotionCounts).map(([emotion, count]) => ({
    emotion,
    count,
    emoji: emotionEmojis[emotion as keyof typeof emotionEmojis],
    fill: emotionColors[emotion as keyof typeof emotionColors]
  }))

  // 파이 차트용 데이터
  const pieData = Object.entries(emotionCounts).map(([emotion, count]) => ({
    name: emotion,
    value: count,
    emoji: emotionEmojis[emotion as keyof typeof emotionEmojis],
    fill: emotionColors[emotion as keyof typeof emotionColors]
  }))

  // 시간별 추이 데이터 (최근 7일)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })

  const trendData = last7Days.map(date => {
    const dayDiaries = diaries.filter(d => d.date === date)
    const dayEmotions = dayDiaries.reduce((acc, diary) => {
      acc[diary.emotion] = (acc[diary.emotion] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      date: new Date(date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      ...dayEmotions,
      total: dayDiaries.length
    }
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}회`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`${data.payload.emoji} ${data.name}`}</p>
          <p style={{ color: data.color }}>{`${data.value}회 (${((data.value / diaries.length) * 100).toFixed(1)}%)`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">감정 통계</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveChart('bar')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeChart === 'bar' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            막대 그래프
          </button>
          <button
            onClick={() => setActiveChart('line')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeChart === 'line' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            추이 그래프
          </button>
          <button
            onClick={() => setActiveChart('pie')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeChart === 'pie' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            원형 그래프
          </button>
        </div>
      </div>

      <div className="h-80">
        {activeChart === 'bar' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="emotion" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${emotionEmojis[value as keyof typeof emotionEmojis]} ${value}`}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'line' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              {Object.keys(emotionColors).map((emotion) => (
                <Line
                  key={emotion}
                  type="monotone"
                  dataKey={emotion}
                  stroke={emotionColors[emotion as keyof typeof emotionColors]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'pie' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${emotionEmojis[name as keyof typeof emotionEmojis]} ${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 통계 요약 */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{diaries.length}</div>
            <div className="text-sm text-gray-500">총 일기 수</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Object.keys(emotionCounts).length}
            </div>
            <div className="text-sm text-gray-500">기록된 감정</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {Object.entries(emotionCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || '-'}
            </div>
            <div className="text-sm text-gray-500">가장 많은 감정</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((diaries.length / Math.max(1, new Set(diaries.map(d => d.date)).size)) * 10) / 10}
            </div>
            <div className="text-sm text-gray-500">일평균 기록</div>
          </div>
        </div>
      </div>
    </div>
  )
}