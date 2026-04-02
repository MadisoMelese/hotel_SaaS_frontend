export const Loading = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <div className="inline-block">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  </div>
)

export const Skeleton = ({ className = '' }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`}></div>
)
