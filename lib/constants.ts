import { NewsSource } from '@/types/news'

export const NEWS_SOURCES: NewsSource[] = [
  // Israeli Sources
  {
    id: 'jpost',
    name: 'The Jerusalem Post',
    url: 'https://www.jpost.com',
    feedUrl: 'https://www.jpost.com/rss',
    country: 'israel',
    language: 'en',
    bias: 'center-right'
  },
  {
    id: 'timesofisrael',
    name: 'Times of Israel',
    url: 'https://www.timesofisrael.com',
    feedUrl: 'https://www.timesofisrael.com/feed/',
    country: 'israel',
    language: 'en',
    bias: 'center'
  },
  {
    id: 'haaretz',
    name: 'Haaretz',
    url: 'https://www.haaretz.com',
    feedUrl: 'https://www.haaretz.com/cmlink/1.5474345',
    country: 'israel',
    language: 'en',
    bias: 'center-left'
  },
  
  // Iranian Sources
  {
    id: 'tasnim',
    name: 'Tasnim News Agency',
    url: 'https://www.tasnimnews.com',
    feedUrl: 'https://www.tasnimnews.com/en/rss',
    country: 'iran',
    language: 'en',
    bias: 'right'
  },
  {
    id: 'mehrnews',
    name: 'Mehr News Agency',
    url: 'https://en.mehrnews.com',
    feedUrl: 'https://en.mehrnews.com/rss',
    country: 'iran',
    language: 'en',
    bias: 'right'
  },
  
  // International Sources
  {
    id: 'aljazeera',
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.com',
    feedUrl: 'https://www.aljazeera.com/xml/rss/all.xml',
    country: 'international',
    language: 'en',
    bias: 'center-left'
  },
  {
    id: 'bbc',
    name: 'BBC Middle East',
    url: 'https://www.bbc.com',
    feedUrl: 'http://feeds.bbci.co.uk/news/world/middle_east/rss.xml',
    country: 'international',
    language: 'en',
    bias: 'center'
  },
  {
    id: 'reuters',
    name: 'Reuters Middle East',
    url: 'https://www.reuters.com',
    feedUrl: 'https://www.reuters.com/rssFeed/middleEastNews',
    country: 'international',
    language: 'en',
    bias: 'center'
  },
  {
    id: 'france24',
    name: 'France 24',
    url: 'https://www.france24.com',
    feedUrl: 'https://www.france24.com/en/middle-east/rss',
    country: 'international',
    language: 'en',
    bias: 'center'
  },
  {
    id: 'cnn',
    name: 'CNN International',
    url: 'https://www.cnn.com',
    feedUrl: 'http://rss.cnn.com/rss/edition_meast.rss',
    country: 'international',
    language: 'en',
    bias: 'center-left'
  }
]

export const REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes
export const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const SEARCH_KEYWORDS = [
  'israel',
  'iran',
  'gaza',
  'hamas',
  'hezbollah',
  'idf',
  'nuclear',
  'sanctions',
  'tehran',
  'jerusalem',
  'tel aviv',
  'conflict',
  'military',
  'defense'
]