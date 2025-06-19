export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <article key={index} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
          <div className="h-56 bg-slate-200" />
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-20 h-4 bg-slate-200 rounded" />
              </div>
              <div className="w-16 h-6 bg-slate-200 rounded-full" />
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-6 bg-slate-200 rounded w-full" />
              <div className="h-6 bg-slate-200 rounded w-3/4" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
              <div className="h-4 bg-slate-200 rounded w-4/6" />
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <div className="w-24 h-4 bg-slate-200 rounded" />
              <div className="w-20 h-4 bg-slate-200 rounded" />
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}