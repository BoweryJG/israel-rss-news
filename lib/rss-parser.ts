import Parser from 'rss-parser'
import { NewsArticle, NewsSource, FeedResponse } from '@/types/news'
import { SEARCH_KEYWORDS } from './constants'
import crypto from 'crypto'

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content', { keepArray: true }],
      ['media:thumbnail', 'media:thumbnail'],
      ['enclosure', 'enclosure'],
      ['dc:creator', 'creator'],
      ['author', 'author'],
      ['description', 'description'],
      ['content:encoded', 'content:encoded'],
    ]
  }
})

function generateArticleId(title: string, link: string, source: string): string {
  const content = `${title}-${link}-${source}`
  return crypto.createHash('md5').update(content).digest('hex')
}

interface FeedItem {
  title?: string
  link?: string
  pubDate?: string
  isoDate?: string
  creator?: string
  author?: string
  content?: string
  contentSnippet?: string
  description?: string
  categories?: string[]
  'media:content'?: any
  'media:thumbnail'?: any
  enclosure?: any
  'content:encoded'?: string
}

function extractImageUrl(item: FeedItem): string | undefined {
  // Try different ways to extract image URL
  try {
    if (item['media:content'] && Array.isArray(item['media:content'])) {
      const image = item['media:content'].find((media: any) => 
        media.$ && media.$.type && media.$.type.startsWith('image/')
      )
      if (image && image.$ && image.$.url) {
        return image.$.url
      }
    }
    
    if (item['media:thumbnail']) {
      // Handle both object and string formats
      if (typeof item['media:thumbnail'] === 'string') {
        return item['media:thumbnail']
      }
      if (item['media:thumbnail'].$ && item['media:thumbnail'].$.url) {
        return item['media:thumbnail'].$.url
      }
      if (item['media:thumbnail'].url) {
        return item['media:thumbnail'].url
      }
    }
    
    if (item.enclosure) {
      // Handle both object and string formats
      if (typeof item.enclosure === 'string') {
        return item.enclosure
      }
      if (item.enclosure.type && item.enclosure.type.startsWith('image/') && item.enclosure.url) {
        return item.enclosure.url
      }
      if (item.enclosure.url && !item.enclosure.type) {
        // Sometimes the type is missing, check if URL looks like an image
        const url = item.enclosure.url
        if (url.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)) {
          return url
        }
      }
    }
  } catch (error) {
    console.error('Error extracting image URL:', error, item)
  }
  
  // Extract from content
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/
  const contentMatch = item.content?.match(imgRegex)
  if (contentMatch) {
    return contentMatch[1]
  }
  
  const descriptionMatch = item.contentSnippet?.match(imgRegex) || item.description?.match(imgRegex)
  if (descriptionMatch) {
    return descriptionMatch[1]
  }
  
  return undefined
}

function isRelevantArticle(title: string, description?: string, content?: string): boolean {
  const searchText = `${title} ${description || ''} ${content || ''}`.toLowerCase()
  return SEARCH_KEYWORDS.some(keyword => searchText.includes(keyword.toLowerCase()))
}

export async function parseFeed(source: NewsSource): Promise<FeedResponse> {
  try {
    console.log(`Parsing feed from ${source.name}: ${source.feedUrl}`)
    const feed = await parser.parseURL(source.feedUrl)
    console.log(`Successfully parsed ${feed.items.length} items from ${source.name}`)
    
    const articles: NewsArticle[] = feed.items
      .filter((item: FeedItem) => isRelevantArticle(item.title || '', item.contentSnippet, item.content))
      .map((item: FeedItem) => ({
        id: generateArticleId(item.title || '', item.link || '', source.id),
        title: item.title || 'Untitled',
        link: item.link || '',
        description: item.contentSnippet || item.description,
        content: item.content || item['content:encoded'],
        pubDate: new Date(item.pubDate || item.isoDate || Date.now()),
        source: source,
        author: item.creator || item.author,
        categories: item.categories || [],
        imageUrl: extractImageUrl(item)
      }))
    
    return {
      articles,
      lastUpdated: new Date()
    }
  } catch (error) {
    console.error(`Error parsing feed from ${source.name}:`, error)
    return {
      articles: [],
      lastUpdated: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function parseMultipleFeeds(sources: NewsSource[]): Promise<NewsArticle[]> {
  const feedPromises = sources.map(source => parseFeed(source))
  const feedResponses = await Promise.allSettled(feedPromises)
  
  const allArticles: NewsArticle[] = []
  
  feedResponses.forEach((response, index) => {
    if (response.status === 'fulfilled') {
      allArticles.push(...response.value.articles)
    } else {
      console.error(`Failed to parse feed from ${sources[index].name}:`, response.reason)
    }
  })
  
  // Sort by publication date (newest first)
  allArticles.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
  
  // Remove duplicates based on title similarity
  const uniqueArticles = allArticles.filter((article, index, self) =>
    index === self.findIndex(a => 
      a.title.toLowerCase().trim() === article.title.toLowerCase().trim() ||
      (a.link === article.link && a.source.id === article.source.id)
    )
  )
  
  return uniqueArticles
}