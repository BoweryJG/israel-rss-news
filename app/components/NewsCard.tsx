'use client'

import { NewsArticle } from '@/types/news'
import { format } from 'date-fns'
import Image from 'next/image'

interface NewsCardProps {
  article: NewsArticle
}

export default function NewsCard({ article }: NewsCardProps) {
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
      {article.imageUrl && typeof article.imageUrl === 'string' && (
        <div className="relative h-48 w-full">
          <Image
            src={article.imageUrl}
            alt={article.title}
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
            <span className={`h-2 w-2 rounded-full ${getCountryColor(article.source.country)}`} />
            <span className="text-sm font-medium text-gray-600">
              {article.source.name}
            </span>
          </div>
          {article.source.bias && (
            <span className={`text-xs px-2 py-1 rounded-full ${getBiasColor(article.source.bias)}`}>
              {article.source.bias}
            </span>
          )}
        </div>
        
        <h2 className="text-xl font-bold mb-2 line-clamp-2">
          <a 
            href={article.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            {article.title}
          </a>
        </h2>
        
        {article.description && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {article.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <time dateTime={article.pubDate.toISOString()}>
            {format(article.pubDate, 'MMM d, yyyy h:mm a')}
          </time>
          {article.author && (
            <span className="truncate max-w-[150px]">
              By {article.author}
            </span>
          )}
        </div>
        
        {article.categories && article.categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {article.categories.slice(0, 3).map((category, index) => (
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
}