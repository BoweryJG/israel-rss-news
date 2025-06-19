import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Israel-Iran News Aggregator',
  description: 'Real-time, unbiased news aggregation from Israeli, Iranian, and international sources',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50`}>
        <header className="bg-gradient-to-r from-blue-900 to-purple-900 text-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  🌍 Global Perspectives
                </h1>
                <p className="text-sm text-blue-100 mt-1">
                  Israel-Iran News Aggregator • Real-time • Unbiased
                </p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-blue-200">Last Updated</p>
                  <p className="text-sm font-medium">{new Date().toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-slate-900 text-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-2">About This Platform</h3>
                <p className="text-sm text-slate-400">
                  Aggregating news from multiple trusted sources to provide balanced coverage of Middle East events.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Sources</h3>
                <p className="text-sm text-slate-400">
                  Israeli, Iranian, and international news outlets including BBC, Reuters, Al Jazeera, and more.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Update Frequency</h3>
                <p className="text-sm text-slate-400">
                  News refreshes automatically every 5 minutes. All times shown in your local timezone.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
              © {new Date().getFullYear()} Global Perspectives • All perspectives included for balanced coverage
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}