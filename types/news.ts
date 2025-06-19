export interface NewsArticle {
  id: string
  title: string
  link: string
  description?: string
  content?: string
  pubDate: Date
  source: NewsSource
  author?: string
  categories?: string[]
  imageUrl?: string
}

export interface NewsSource {
  id: string
  name: string
  url: string
  feedUrl: string
  country: 'israel' | 'iran' | 'international'
  language: string
  bias?: 'left' | 'center-left' | 'center' | 'center-right' | 'right'
}

export interface FeedResponse {
  articles: NewsArticle[]
  lastUpdated: Date
  error?: string
}

export interface AggregatedNews {
  articles: NewsArticle[]
  sources: NewsSource[]
  lastUpdated: Date
  totalCount: number
}