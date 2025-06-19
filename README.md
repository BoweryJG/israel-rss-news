# Israel-Iran News Aggregator

A real-time news aggregation website that provides unbiased coverage of the Israel-Iran conflict by pulling news from multiple perspectives including Israeli, Iranian, and international sources.

## Features

- **Multi-Source Aggregation**: Pulls news from 10+ reputable sources including:
  - Israeli sources: Jerusalem Post, Times of Israel, Haaretz
  - Iranian sources: Tasnim News, Mehr News
  - International sources: Al Jazeera, BBC, Reuters, CNN, France 24
  
- **Real-Time Updates**: Automatically refreshes every 5 minutes with manual refresh option
- **Smart Filtering**: 
  - Filter by country/region (Israel, Iran, International)
  - Filter by specific news source
  - Search across all articles
  
- **Bias Transparency**: Shows media bias indicators for each source
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Article Deduplication**: Automatically removes duplicate stories

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd "Israel RSS"
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **RSS Parsing**: rss-parser
- **Date Formatting**: date-fns
- **Image Optimization**: Next.js Image component

## Project Structure

```
israel-rss/
├── app/
│   ├── api/
│   │   └── news/route.ts      # API endpoint for fetching news
│   ├── components/
│   │   ├── NewsCard.tsx       # Individual news article component
│   │   └── SourceFilter.tsx   # Filter controls component
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── lib/
│   ├── constants.ts           # News sources configuration
│   └── rss-parser.ts          # RSS parsing utilities
├── types/
│   └── news.ts                # TypeScript type definitions
└── package.json
```

## API Endpoints

### GET /api/news
Fetches aggregated news from all configured sources.

Query parameters:
- `source`: Filter by specific source ID
- `country`: Filter by country (israel, iran, international)
- `limit`: Maximum number of articles to return (default: 50)

### POST /api/news
Forces a cache refresh and fetches fresh data from all sources.

## Adding New Sources

To add a new RSS feed source, edit `lib/constants.ts`:

```typescript
export const NEWS_SOURCES: NewsSource[] = [
  // ... existing sources
  {
    id: 'newsource',
    name: 'New Source Name',
    url: 'https://newsource.com',
    feedUrl: 'https://newsource.com/rss',
    country: 'international', // or 'israel', 'iran'
    language: 'en',
    bias: 'center' // left, center-left, center, center-right, right
  }
]
```

## Deployment

This app is ready for deployment on Vercel:

```bash
npm run build
npm start
```

Or deploy directly to Vercel:
```bash
vercel
```

## Performance Considerations

- RSS feeds are cached for 5 minutes to reduce server load
- Images are optimized automatically by Next.js
- Article deduplication prevents redundant content
- Relevance filtering ensures only Israel-Iran related news is shown

## Future Enhancements

- Add more news sources
- Implement user preferences/saved filters
- Add email alerts for breaking news
- Sentiment analysis for articles
- Translation support for non-English sources
- Historical news archive
- Social media sharing features

## License

MIT License