'use client'

import { NewsSource } from '@/types/news'
import { useState } from 'react'

interface SourceFilterProps {
  sources: NewsSource[]
  selectedSource: string | null
  selectedCountry: string | null
  onSourceChange: (sourceId: string | null) => void
  onCountryChange: (country: string | null) => void
}

export default function SourceFilter({
  sources,
  selectedSource,
  selectedCountry,
  onSourceChange,
  onCountryChange
}: SourceFilterProps) {
  // Ensure sources is always an array
  const safeSources = Array.isArray(sources) ? sources : []
  const [isExpanded, setIsExpanded] = useState(false)

  const countries = [
    { id: 'all', name: 'All Sources', value: null },
    { id: 'israel', name: 'Israeli Sources', value: 'israel' },
    { id: 'iran', name: 'Iranian Sources', value: 'iran' },
    { id: 'international', name: 'International', value: 'international' }
  ]

  const getCountryColor = (country: string | null) => {
    switch (country) {
      case 'israel':
        return 'bg-blue-500 text-white'
      case 'iran':
        return 'bg-green-500 text-white'
      case 'international':
        return 'bg-purple-500 text-white'
      default:
        return 'bg-gray-200 text-gray-700'
    }
  }

  const filteredSources = selectedCountry
    ? safeSources.filter(s => s.country === selectedCountry)
    : safeSources

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filter News Sources</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-800 md:hidden"
        >
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className={`space-y-4 ${!isExpanded && 'hidden md:block'}`}>
        {/* Country Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">By Region</h3>
          <div className="flex flex-wrap gap-2">
            {countries.map(country => (
              <button
                key={country.id}
                onClick={() => {
                  onCountryChange(country.value)
                  onSourceChange(null)
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCountry === country.value
                    ? getCountryColor(country.value)
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {country.name}
              </button>
            ))}
          </div>
        </div>

        {/* Source Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">By Source</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <button
              onClick={() => onSourceChange(null)}
              className={`px-3 py-2 rounded text-sm transition-colors ${
                !selectedSource
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              All Sources
            </button>
            {filteredSources.map(source => (
              <button
                key={source.id}
                onClick={() => onSourceChange(source.id)}
                className={`px-3 py-2 rounded text-sm transition-colors truncate ${
                  selectedSource === source.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title={source.name}
              >
                {source.name}
              </button>
            ))}
          </div>
        </div>

        {/* Bias Indicator Legend */}
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Media Bias Legend</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">Left</span>
            <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700">Center-Left</span>
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800">Center</span>
            <span className="px-2 py-1 rounded-full bg-red-50 text-red-700">Center-Right</span>
            <span className="px-2 py-1 rounded-full bg-red-100 text-red-800">Right</span>
          </div>
        </div>
      </div>
    </div>
  )
}