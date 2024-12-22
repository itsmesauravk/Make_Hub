import React from "react"

const RecipeCardSkeleton = () => {
  return (
    <div
      className={`bg-white shadow-lg rounded-lg overflow-hidden w-80 mx-auto cursor-pointer animate-pulse`}
    >
      <div className="w-full h-48 bg-gray-300"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
        <div className="flex space-x-2">
          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
        </div>
      </div>
      <div className="flex justify-around items-center bg-gray-100 py-2">
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  )
}

export default RecipeCardSkeleton
