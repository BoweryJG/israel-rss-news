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
        return 'bg-blue-100 text-blue-800'
      case 'center-left':
        return 'bg-blue-50 text-blue-700'
      case 'center':
        return 'bg-gray-100 text-gray-800'
      case 'center-right':
        return 'bg-red-50 text-red-700'
      case 'right':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCountryColor = (country: string) => {
    switch (country) {
      case 'israel':
        return 'bg-blue-500'
      case 'iran':
        return 'bg-green-500'
      case 'international':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {safeArticle.imageUrl && typeof safeArticle.imageUrl === 'string' && (
        <div className="relative h-48 w-full">
          <Image
            src={safeArticle.imageUrl}
            alt={safeArticle.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // Hide image on error
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${getCountryColor(safeArticle.source.country)}`} />
            <span className="text-sm font-medium text-gray-600">
              {safeArticle.source.name}
            </span>
          </div>
          {safeArticle.source.bias && (
            <span className={`text-xs px-2 py-1 rounded-full ${getBiasColor(safeArticle.source.bias)}`}>
              {safeArticle.source.bias}
            </span>
          )}
        </div>
        
        <h2 className="text-xl font-bold mb-2 line-clamp-2">
          <a 
            href={safeArticle.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            {safeArticle.title}
          </a>
        </h2>
        
        {safeArticle.description && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {safeArticle.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <time dateTime={safeArticle.pubDate instanceof Date ? safeArticle.pubDate.toISOString() : new Date(safeArticle.pubDate).toISOString()}>
            {format(safeArticle.pubDate instanceof Date ? safeArticle.pubDate : new Date(safeArticle.pubDate), 'MMM d, yyyy h:mm a')}
          </time>
          {safeArticle.author && (
            <span className="truncate max-w-[150px]">
              By {safeArticle.author}
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