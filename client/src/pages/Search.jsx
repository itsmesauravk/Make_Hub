import React, { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import Navbar from "../components/Navbar"
import { FaSearch } from "react-icons/fa"
import RecipeCard from "../components/recipe/cards"
import { Spinner } from "../components/loader"

const Search = () => {
  const textRef = useRef(null)
  const imageRef = useRef(null)
  const searchRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [popularSearches, setPopularSearches] = useState([
    "Chicken ",
    "Pancake",
    "Noodle",
    "Water",
    "drink",
  ])

  const [loading, setLoading] = useState(false)

  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    const text = textRef.current
    const image = imageRef.current
    const search = searchRef.current

    gsap.fromTo(
      text,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        delay: 0.5,
        ease: "power3.out",
      }
    )

    gsap.fromTo(
      image,
      { opacity: 0, y: 50, scale: 0.5 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        delay: 1,
        ease: "power3.out",
      }
    )

    gsap.fromTo(
      search,
      { opacity: 0, width: "50%" },
      {
        opacity: 1,
        width: "100%",
        duration: 1.2,
        delay: 0.8,
        ease: "power3.out",
      }
    )
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()

    console.log("Search Term:", searchTerm)
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/recipe/search?term=${searchTerm}`
      )
      const data = await response.json()
      if (data.success) {
        setSearchResults(data.recipes.slice(0, 6))
        setLoading(false)
      }
    } catch (error) {
      console.log("Error searching for recipes", error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  console.log("Search Results:", searchResults)

  return (
    <div>
      <Navbar />
      <div className="h-screen flex flex-col items-center mt-20  p-4">
        <div ref={textRef} className="text-3xl font-bold mb-6 text-center">
          Find the Perfect Recipe
        </div>
        <form
          ref={searchRef}
          onSubmit={handleSearch}
          className="flex items-center w-full max-w-3xl"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-4 border border-gray-300 rounded-l-full focus:outline-none"
            placeholder="Search for recipes..."
          />
          <button
            type="submit"
            className="p-4 bg-primary-dark text-white rounded-r-full"
          >
            <FaSearch size={24} />
          </button>
        </form>
        {/* popular searches */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Popular Searches</h2>
          <div className="flex flex-wrap justify-center">
            {popularSearches.map((item, index) => (
              <button
                key={index}
                onClick={() => setSearchTerm(item)}
                className="bg-gray-200 text-gray-800 px-4 py-2 m-2 rounded-full hover:bg-gray-300 transition-all"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* border div  */}
        <div
          className="border-t border-gray-300 my-8 w-full
        max-w-3xl"
        ></div>

        {/* loading spinner */}
        {loading ? (
          <div className="mt-8">
            <Spinner
              width={"50px"}
              height={"50px"}
              backgroundColor={"#F3043A"}
              padding={"4px"}
            />
          </div>
        ) : (
          <>
            {/* // search results */}
            {searchResults.length > 0 ? (
              <div className="container mx-auto px-4 py-8">
                <h2 className="flex justify-center items-center text-2xl font-semibold text-gray-800 mb-6">
                  Search Results for "{searchTerm}"
                </h2>
                <div className="flex gap-4 flex-wrap justify-center items-center">
                  {searchResults.map((recipe) => (
                    <RecipeCard key={recipe._id} recipeDetails={recipe} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-2xl font-semibold text-gray-500 mt-8">
                No results found for "{searchTerm}"
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Search
