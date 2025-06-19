'use client'

import { useState, useEffect } from 'react'
import NewsCard from './components/NewsCard'
import SourceFilter from './components/SourceFilter'
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
      
      // Convert date strings back to Date objects
      const processedData = {
        ...data,
        articles: (data.articles || []).map((article: any) => ({
          ...article,
          pubDate: new Date(article.pubDate)
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
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
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
      {/* Stats Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-gray-600">
              <strong className="text-gray-900">{data?.totalCount || 0}</strong> articles
            </span>
            <span className="text-gray-600">
              <strong className="text-gray-900">{data?.sources.length || 0}</strong> sources
            </span>
            <span className="text-gray-600">
              Last updated: <strong className="text-gray-900">
                {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : 'Never'}
              </strong>
            </span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isRefreshing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Refreshing...
              </>
            ) : (
              'Refresh Now'
            )}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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