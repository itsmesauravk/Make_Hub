import React, { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import RecipeCard from "../components/recipe/cards"
import { Pagination } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import FetchErrorPage from "../components/FetchErrorPage"
import { Spinner } from "../components/loader"

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedSort, setSelectedSort] = useState("newest")

  const location = useLocation()
  const navigate = useNavigate()

  const getPage = () => {
    const pageParam = new URLSearchParams(location.search).get("page")
    return pageParam ? parseInt(pageParam) : 1
  }

  useEffect(() => {
    setPage(getPage())
  }, [location.search])

  const handlePageChange = (event, value) => {
    navigate(`?page=${value}`)
    setPage(value)
  }

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        page,
        limit: 8,
        type: selectedType,
        category: selectedCategory,
        sort: selectedSort,
      }).toString()

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/recipe/filter-recipes?${queryParams}`
      )
      const data = await response.json()

      if (data.success) {
        setRecipes(data.data)
        setTotalPages(data.pages)
        setLoading(false)
        setFetchError(false)
      } else {
        console.log(data.message)
        setLoading(false)
        setFetchError(true)
      }
    } catch (error) {
      console.log("Something Went Wrong, Try Again", error)
      setLoading(false)
      setFetchError(true)
    }
  }

  useEffect(() => {
    fetchRecipes()
  }, [page, selectedCategory, selectedType, selectedSort])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  return (
    <div>
      <Navbar />
      {fetchError && <FetchErrorPage />}
      <div className="flex flex-col gap-10 items-center my-auto w-3/4 mx-auto mt-20">
        {loading ? (
          <Spinner
            width={"50px"}
            height={"50px"}
            backgroundColor={"#F3043A"}
            padding={"4px"}
          />
        ) : (
          <>
            <div className="mx-auto mt-10">
              {/* Filter Section */}
              <div className="flex justify-between mb-6">
                <select
                  className="border border-gray-300 p-2 rounded"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                  <option value="dessert">Dessert</option>
                  <option value="appetizer">Appetizer</option>
                  <option value="main course">Main Course</option>
                  <option value="side dish">Side Dish</option>
                  <option value="beverage">Beverage</option>
                  <option value="salad">Salad</option>
                  <option value="cocktails">Cocktails</option>
                  <option value="smoothies">Smoothies</option>
                  <option value="juices">Juices</option>
                  <option value="soft drinks">Soft Drinks</option>
                  <option value="hard drinks">Hard Drinks</option>
                  <option value="hot drinks">Hot Drinks</option>
                  <option value="cold drinks">Cold Drinks</option>
                </select>

                <select
                  className="border border-gray-300 p-2 rounded"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="drink">Drinks</option>
                </select>

                <select
                  className="border border-gray-300 p-2 rounded"
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="popular">Popular</option>
                  <option value="high-low">Rating: High to Low</option>
                  <option value="low-high">Rating: Low to High</option>
                </select>
              </div>

              {/* Recipes Grid */}
              <div className="container mx-auto flex flex-wrap gap-5 mt-10">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipeDetails={recipe} />
                ))}
              </div>
            </div>

            {/* Pagination */}
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="secondary"
            />
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default AllRecipes
