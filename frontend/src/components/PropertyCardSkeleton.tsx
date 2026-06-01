export default function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-100 rounded-full w-1/3" />
        <div className="h-5 bg-gray-100 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="flex justify-between pt-3 border-t border-gray-50">
          <div className="h-3 bg-gray-100 rounded-full w-16" />
          <div className="h-5 bg-gray-100 rounded-full w-24" />
        </div>
      </div>
    </div>
  )
}
