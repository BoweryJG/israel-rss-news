'use client'

import { useState, useEffect } from 'react'
import NewsCard from './components/NewsCard'
import SourceFilter from './components/SourceFilter'
import LoadingSkeleton from './components/LoadingSkeleton'
import { AggregatedNews } from '@/types/news'
import { REFRESH_INTERVAL } from '@/lib/constants'

export default function Home() {
  const [data, setData] = useState<AggregatedNews | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchNews = async () => {
    try {
      setError(null)
      const params = new URLSearchParams()
      if (selectedSource) params.append('source', selectedSource)
      if (selectedCountry) params.append('country', selectedCountry)
      
      const response = await fetch(`/api/news?${params}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch news: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Convert date strings back to Date objects and ensure all data is serializable
      const processedData = {
        ...data,
        articles: (data.articles || []).map((article: any) => ({
          ...article,
          pubDate: new Date(article.pubDate),
          // Ensure all string fields are actually strings
          title: String(article.title || ''),
          link: String(article.link || ''),
          description: article.description ? String(article.description) : undefined,
          content: article.content ? String(article.content) : undefined,
          author: article.author ? String(article.author) : undefined,
          imageUrl: article.imageUrl ? String(article.imageUrl) : undefined,
          // Ensure categories is an array of strings
          categories: Array.isArray(article.categories) 
            ? article.categories.map((cat: any) => String(cat))
            : []
        }))
      }
      setData(processedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/news', { method: 'POST' })
      if (response.ok) {
        await fetchNews()
      }
    } catch (err) {
      console.error('Failed to refresh:', err)
    }
  }

  useEffect(() => {
    fetchNews()
    const interval = setInterval(fetchNews, REFRESH_INTERVAL)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSource, selectedCountry])

  const filteredArticles = data?.articles.filter(article => {
    if (!searchQuery) return true
    const searchLower = searchQuery.toLowerCase()
    return (
      article.title.toLowerCase().includes(searchLower) ||
      article.description?.toLowerCase().includes(searchLower) ||
      article.source.name.toLowerCase().includes(searchLower)
    )
  }) || []

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl shadow-xl p-8 mb-8 animate-pulse">
          <div className="h-32 bg-slate-700 rounded-lg"></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 mb-8">
          <div className="h-14 bg-slate-200 rounded-lg"></div>
        </div>
        <LoadingSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={fetchNews}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Stats Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl shadow-xl p-8 mb-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">{data?.totalCount || 0}</div>
            <div className="text-slate-300 text-sm">Total Articles</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">{data?.sources.length || 0}</div>
            <div className="text-slate-300 text-sm">News Sources</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">
              {data?.articles ? data.articles.filter(a => a.source.country === 'israel').length : 0}
            </div>
            <div className="text-slate-300 text-sm">Israeli Sources 🇮🇱</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">
              {data?.articles ? data.articles.filter(a => a.source.country === 'iran').length : 0}
            </div>
            <div className="text-slate-300 text-sm">Iranian Sources 🇮🇷</div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-400">
            Last updated: {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : 'Never'}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-6 py-3 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {isRefreshing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900"></div>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Now
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 mb-8">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search articles by title, description, or source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
      </div>

      {/* Filters */}
      <SourceFilter
        sources={data?.sources || []}
        selectedSource={selectedSource}
        selectedCountry={selectedCountry}
        onSourceChange={setSelectedSource}
        onCountryChange={setSelectedCountry}
      />

      {/* News Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No articles found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}