import React from "react"

const TopRecipesSkeleton = () => {
  return (
    <div
      className="relative flex max-w-sm rounded overflow-hidden shadow-lg m-4 animate-pulse"
      style={{
        height: "350px",
        width: "300px",
        backgroundColor: "#e0e0e0", // Light gray background to simulate loading
      }}
    >
      <div className="absolute bottom-0 left-0 w-full h-[45%] bg-gray-400 bg-opacity-55 text-white flex flex-col items-baseline justify-end px-6 py-4">
        <div className="w-3/4 h-6 bg-gray-500 mb-4"></div>
        <div className="w-full h-4 bg-gray-500 mb-2"></div>
        <div className="w-1/2 h-4 bg-gray-500"></div>
      </div>
    </div>
  )
}

export default TopRecipesSkeleton
