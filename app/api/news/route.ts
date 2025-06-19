import { NextRequest, NextResponse } from 'next/server'
import { parseMultipleFeeds } from '@/lib/rss-parser'
import { NEWS_SOURCES, CACHE_DURATION } from '@/lib/constants'
import { AggregatedNews } from '@/types/news'

// Simple in-memory cache
let cachedData: AggregatedNews | null = null
let cacheTimestamp: number = 0

export async function GET(request: NextRequest) {
  console.log('News API called')
  try {
    const searchParams = request.nextUrl.searchParams
    const sourceFilter = searchParams.get('source')
    const countryFilter = searchParams.get('country')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    console.log('Filters:', { sourceFilter, countryFilter, limit })
    
    // Check cache
    const now = Date.now()
    if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
      let articles = cachedData.articles
      
      // Apply filters
      if (sourceFilter) {
        articles = articles.filter(article => article.source.id === sourceFilter)
      }
      if (countryFilter) {
        articles = articles.filter(article => article.source.country === countryFilter)
      }
      
      // Apply limit
      articles = articles.slice(0, limit)
      
      return NextResponse.json({
        ...cachedData,
        articles,
        totalCount: articles.length
      })
    }
    
    // Fetch fresh data
    const sourcesToFetch = sourceFilter 
      ? NEWS_SOURCES.filter(s => s.id === sourceFilter)
      : countryFilter
      ? NEWS_SOURCES.filter(s => s.country === countryFilter)
      : NEWS_SOURCES
    
    console.log('Fetching from sources:', sourcesToFetch.map(s => s.name))
    const articles = await parseMultipleFeeds(sourcesToFetch)
    console.log('Fetched articles:', articles.length)
    
    // Update cache with full data
    if (!sourceFilter && !countryFilter) {
      cachedData = {
        articles,
        sources: NEWS_SOURCES,
        lastUpdated: new Date(),
        totalCount: articles.length
      }
      cacheTimestamp = now
    }
    
    // Apply limit
    const limitedArticles = articles.slice(0, limit)
    
    const response: AggregatedNews = {
      articles: limitedArticles.map(article => ({
        ...article,
        // Ensure imageUrl is a string or undefined
        imageUrl: typeof article.imageUrl === 'string' ? article.imageUrl : undefined
      })),
      sources: sourcesToFetch,
      lastUpdated: new Date(),
      totalCount: limitedArticles.length
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in news API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

// Optional: Force refresh endpoint
export async function POST() {
  try {
    // Clear cache
    cachedData = null
    cacheTimestamp = 0
    
    // Fetch fresh data
    const articles = await parseMultipleFeeds(NEWS_SOURCES)
    
    cachedData = {
      articles,
      sources: NEWS_SOURCES,
      lastUpdated: new Date(),
      totalCount: articles.length
    }
    cacheTimestamp = Date.now()
    
    return NextResponse.json({
      message: 'Cache refreshed successfully',
      articlesCount: articles.length
    })
  } catch (error) {
    console.error('Error refreshing cache:', error)
    return NextResponse.json(
      { error: 'Failed to refresh cache' },
      { status: 500 }
    )
  }
}