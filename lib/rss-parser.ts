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
    ]
  }
})

function generateArticleId(title: string, link: string, source: string): string {
  const content = `${title}-${link}-${source}`
  return crypto.createHash('md5').update(content).digest('hex')
}

function extractImageUrl(item: any): string | undefined {
  // Try different ways to extract image URL
  if (item['media:content'] && Array.isArray(item['media:content'])) {
    const image = item['media:content'].find((media: any) => 
      media.$ && media.$.type && media.$.type.startsWith('image/')
    )
    if (image && image.$ && image.$.url) {
      return image.$.url
    }
  }
  
  if (item['media:thumbnail'] && item['media:thumbnail'].$ && item['media:thumbnail'].$.url) {
    return item['media:thumbnail'].$.url
  }
  
  if (item.enclosure && item.enclosure.type && item.enclosure.type.startsWith('image/') && item.enclosure.url) {
    return item.enclosure.url
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
    const feed = await parser.parseURL(source.feedUrl)
    
    const articles: NewsArticle[] = feed.items
      .filter(item => isRelevantArticle(item.title || '', item.contentSnippet, item.content))
      .map(item => ({
        id: generateArticleId(item.title || '', item.link || '', source.id),
        title: item.title || 'Untitled',
        link: item.link || '',
        description: item.contentSnippet || item.description,
        content: item.content,
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