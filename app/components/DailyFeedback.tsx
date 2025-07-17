'use client'

import { Diary } from '../page'
import { useState, useEffect } from 'react'

interface DailyFeedbackProps {
  diaries: Diary[]
}

interface FeedbackMessage {
  greeting: string
  reflection: string
  encouragement: string
  emoji: string
  bgColor: string
  textColor: string
}

const emotionFeedbacks: Record<string, FeedbackMessage[]> = {
  '기쁨': [
    {
      greeting: "오늘 하루는 정말 기쁘셨군요!",
      reflection: "행복한 순간들이 가득했던 것 같아요.",
      encouragement: "내일도 이런 즐거운 하루가 되길 바라요!",
      emoji: "🌟",
      bgColor: "bg-gradient-to-r from-yellow-100 to-orange-100",
      textColor: "text-yellow-800"
    },
    {
      greeting: "오늘은 웃음이 가득한 하루였네요!",
      reflection: "긍정적인 에너지가 느껴져요.",
      encouragement: "앞으로도 이런 밝은 마음을 유지하세요!",
      emoji: "✨",
      bgColor: "bg-gradient-to-r from-yellow-100 to-orange-100",
      textColor: "text-yellow-800"
    }
  ],
  '슬픔': [
    {
      greeting: "오늘 하루는 조금 힘드셨군요.",
      reflection: "슬픈 감정도 소중한 마음의 표현이에요.",
      encouragement: "내일은 더 밝은 하루가 되길 바라요!",
      emoji: "🌙",
      bgColor: "bg-gradient-to-r from-blue-100 to-indigo-100",
      textColor: "text-blue-800"
    },
    {
      greeting: "오늘은 마음이 무거웠나 보네요.",
      reflection: "때로는 슬픔을 느끼는 것도 자연스러운 일이에요.",
      encouragement: "곧 다시 웃을 수 있는 날이 올 거예요!",
      emoji: "🌈",
      bgColor: "bg-gradient-to-r from-blue-100 to-indigo-100",
      textColor: "text-blue-800"
    }
  ],
  '화남': [
    {
      greeting: "오늘 하루는 화가 나는 일이 있었군요.",
      reflection: "분노도 중요한 감정 중 하나예요.",
      encouragement: "내일은 더 평온한 하루가 되길 바라요!",
      emoji: "🔥",
      bgColor: "bg-gradient-to-r from-red-100 to-pink-100",
      textColor: "text-red-800"
    },
    {
      greeting: "오늘은 속상한 일들이 있었나 보네요.",
      reflection: "화난 마음을 표현하는 것도 건강한 일이에요.",
      encouragement: "내일은 마음이 차분해지길 바라요!",
      emoji: "🌊",
      bgColor: "bg-gradient-to-r from-red-100 to-pink-100",
      textColor: "text-red-800"
    }
  ],
  '불안': [
    {
      greeting: "오늘 하루는 불안하셨군요.",
      reflection: "걱정이 많았던 하루였나 봐요.",
      encouragement: "내일은 더 안정된 마음으로 보내세요!",
      emoji: "🕊️",
      bgColor: "bg-gradient-to-r from-purple-100 to-pink-100",
      textColor: "text-purple-800"
    },
    {
      greeting: "오늘은 마음이 편치 않으셨나요?",
      reflection: "불안한 감정을 인정하는 것도 용기예요.",
      encouragement: "내일은 더 평안한 하루가 되길 바라요!",
      emoji: "🌸",
      bgColor: "bg-gradient-to-r from-purple-100 to-pink-100",
      textColor: "text-purple-800"
    }
  ],
  '평온': [
    {
      greeting: "오늘 하루는 평온하셨군요.",
      reflection: "마음의 안정을 찾으신 것 같아요.",
      encouragement: "내일도 이런 고요한 평화가 함께하길 바라요!",
      emoji: "🍃",
      bgColor: "bg-gradient-to-r from-green-100 to-teal-100",
      textColor: "text-green-800"
    },
    {
      greeting: "오늘은 차분한 하루를 보내셨네요.",
      reflection: "내면의 평화를 느끼셨나 봐요.",
      encouragement: "앞으로도 이런 고요함을 유지하세요!",
      emoji: "🧘‍♀️",
      bgColor: "bg-gradient-to-r from-green-100 to-teal-100",
      textColor: "text-green-800"
    }
  ],
  '흥분': [
    {
      greeting: "오늘 하루는 정말 신나셨군요!",
      reflection: "에너지가 넘치는 하루였나 봐요.",
      encouragement: "내일도 이런 활기찬 하루가 되길 바라요!",
      emoji: "🎉",
      bgColor: "bg-gradient-to-r from-orange-100 to-red-100",
      textColor: "text-orange-800"
    },
    {
      greeting: "오늘은 흥미진진한 하루였네요!",
      reflection: "열정적인 에너지가 느껴져요.",
      encouragement: "앞으로도 이런 활력을 잃지 마세요!",
      emoji: "🚀",
      bgColor: "bg-gradient-to-r from-orange-100 to-red-100",
      textColor: "text-orange-800"
    }
  ]
}

const generalFeedbacks: FeedbackMessage[] = [
  {
    greeting: "오늘도 하루를 잘 마무리하셨네요.",
    reflection: "다양한 감정을 경험하며 성장하고 계세요.",
    encouragement: "내일도 멋진 하루가 되길 바라요!",
    emoji: "💫",
    bgColor: "bg-gradient-to-r from-indigo-100 to-purple-100",
    textColor: "text-indigo-800"
  },
  {
    greeting: "오늘 하루도 수고 많으셨어요.",
    reflection: "감정을 기록하는 것만으로도 큰 의미가 있어요.",
    encouragement: "내일은 더 좋은 일들이 기다리고 있을 거예요!",
    emoji: "🌺",
    bgColor: "bg-gradient-to-r from-indigo-100 to-purple-100",
    textColor: "text-indigo-800"
  }
]

export default function DailyFeedback({ diaries }: DailyFeedbackProps) {
  const [currentFeedback, setCurrentFeedback] = useState<FeedbackMessage | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  // 오늘 날짜 가져오기
  const today = new Date().toISOString().split('T')[0]
  const todayDiaries = diaries.filter(diary => diary.date === today)

  useEffect(() => {
    if (todayDiaries.length > 0) {
      generateDailyFeedback()
    }
  }, [diaries])

  const generateDailyFeedback = () => {
    if (todayDiaries.length === 0) return

    // 오늘의 주요 감정 찾기 (가장 최근 감정 또는 가장 많이 기록된 감정)
    const latestEmotion = todayDiaries[0].emotion
    const emotionCounts = todayDiaries.reduce((acc, diary) => {
      acc[diary.emotion] = (acc[diary.emotion] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const dominantEmotion = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || latestEmotion

    // 해당 감정에 맞는 피드백 선택
    const emotionFeedbackList = emotionFeedbacks[dominantEmotion] || generalFeedbacks
    const randomIndex = Math.floor(Math.random() * emotionFeedbackList.length)
    const selectedFeedback = emotionFeedbackList[randomIndex]

    setCurrentFeedback(selectedFeedback)
    setShowFeedback(true)
  }

  const getEmotionSummary = () => {
    if (todayDiaries.length === 0) return null

    const emotionCounts = todayDiaries.reduce((acc, diary) => {
      acc[diary.emotion] = (acc[diary.emotion] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const emotions = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([emotion, count]) => `${emotion}(${count}회)`)

    return emotions.join(', ')
  }

  if (todayDiaries.length === 0) {
    return (
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-6 mb-6">
        <div className="text-center">
          <div className="text-4xl mb-3">🌅</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">오늘의 감정을 기록해보세요!</h3>
          <p className="text-gray-600">첫 번째 일기를 작성하면 맞춤형 피드백을 받을 수 있어요.</p>
        </div>
      </div>
    )
  }

  if (!showFeedback || !currentFeedback) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">오늘의 감정 요약</h3>
            <p className="text-gray-600">{getEmotionSummary()}</p>
          </div>
          <button
            onClick={generateDailyFeedback}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            피드백 받기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`${currentFeedback.bgColor} rounded-xl p-6 mb-6 border border-opacity-20`}>
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{currentFeedback.emoji}</div>
        <div className="flex-1">
          <div className={`${currentFeedback.textColor} space-y-3`}>
            <h3 className="text-xl font-bold">{currentFeedback.greeting}</h3>
            <p className="text-lg leading-relaxed">{currentFeedback.reflection}</p>
            <p className="text-lg font-medium">{currentFeedback.encouragement}</p>
          </div>

          <div className="mt-4 pt-4 border-t border-white border-opacity-30">
            <div className="flex justify-between items-center">
              <div className={`text-sm ${currentFeedback.textColor} opacity-75`}>
                오늘의 감정: {getEmotionSummary()}
              </div>
              <button
                onClick={() => setShowFeedback(false)}
                className={`text-sm ${currentFeedback.textColor} hover:opacity-75 transition-opacity`}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}