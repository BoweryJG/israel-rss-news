'use client'

import { NewsArticle } from '@/types/news'
import { format } from 'date-fns'
import Image from 'next/image'

interface NewsCardProps {
  article: NewsArticle
}

interface SafeArticle extends Omit<NewsArticle, 'pubDate'> {
  pubDate: Date | string
}

export default function NewsCard({ article }: NewsCardProps) {
  try {
    // Ensure article is safe to render
    const safeArticle: SafeArticle = {
      ...article,
      pubDate: article.pubDate instanceof Date ? article.pubDate : new Date(article.pubDate)
    }
  const getBiasColor = (bias?: string) => {
    switch (bias) {
      case 'left':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
      case 'center-left':
        return 'bg-gradient-to-r from-blue-400 to-blue-500 text-white'
      case 'center':
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
      case 'center-right':
        return 'bg-gradient-to-r from-red-400 to-red-500 text-white'
      case 'right':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white'
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
    }
  }

  const getCountryColor = (country: string) => {
    switch (country) {
      case 'israel':
        return 'bg-blue-600'
      case 'iran':
        return 'bg-emerald-600'
      case 'international':
        return 'bg-purple-600'
      default:
        return 'bg-gray-600'
    }
  }
  
  const getCountryEmoji = (country: string) => {
    switch (country) {
      case 'israel':
        return '🇮🇱'
      case 'iran':
        return '🇮🇷'
      case 'international':
        return '🌐'
      default:
        return '📰'
    }
  }

  return (
    <article className="group bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-slate-200">
      {safeArticle.imageUrl && typeof safeArticle.imageUrl === 'string' && (
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={safeArticle.imageUrl}
            alt={safeArticle.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // Hide image on error
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getCountryEmoji(safeArticle.source.country)}</span>
            <span className="text-sm font-semibold text-slate-700">
              {safeArticle.source.name}
            </span>
          </div>
          {safeArticle.source.bias && (
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${getBiasColor(safeArticle.source.bias)}`}>
              {safeArticle.source.bias.replace('-', ' ')}
            </span>
          )}
        </div>
        
        <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
          <a 
            href={safeArticle.link} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {safeArticle.title}
          </a>
        </h2>
        
        {safeArticle.description && (
          <p className="text-slate-600 mb-4 line-clamp-3 leading-relaxed">
            {safeArticle.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
          <time dateTime={safeArticle.pubDate instanceof Date ? safeArticle.pubDate.toISOString() : new Date(safeArticle.pubDate).toISOString()} className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {format(safeArticle.pubDate instanceof Date ? safeArticle.pubDate : new Date(safeArticle.pubDate), 'MMM d, h:mm a')}
          </time>
          {safeArticle.author && (
            <span className="truncate max-w-[150px] flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {safeArticle.author}
            </span>
          )}
        </div>
        
        {safeArticle.categories && safeArticle.categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {safeArticle.categories.slice(0, 3).map((category, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
              >
                {category}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
  } catch (error) {
    console.error('Error rendering NewsCard:', error, article)
    return (
      <article className="bg-white rounded-lg shadow-md p-6">
        <p className="text-red-600">Error displaying article</p>
      </article>
    )
  }
}