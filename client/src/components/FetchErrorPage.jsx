import React from "react"

const FetchErrorPage = () => {
  const handleReload = () => {
    window.location.reload()
  }

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="flex flex-col items-center justify-center h-[400px] w-screen bg-gray-200 text-gray-400">
      <img
        src="/images/fetcherror.png"
        alt="server error"
        className="h-56 w-56"
      />
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="text-lg mb-1">Reason might be:</p>
      <p className="text-base ">Check your Internet Connection</p>
      <p className="text-base mb-6">Internal Server Error</p>

      <div className="space-x-4">
        <button
          onClick={handleReload}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Reload
        </button>
        <button
          onClick={handleGoBack}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}

export default FetchErrorPage
