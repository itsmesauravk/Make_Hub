import React, { useEffect, useState } from "react"
import recipes from "../data/recipes.json"
import RecipeCard from "./recipe/cards"

const MostLiked = () => {
  const [mostLiked, setMostLiked] = useState([])

  //this will change later
  const getMostLikedRecipes = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: 1,
        limit: 8,
        type: "all",
        category: "all",
        sort: "high-low",
      }).toString()

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/recipe/filter-recipes?${queryParams}`
      )
      const data = await response.json()
      if (data.success) {
        setMostLiked(data.data)
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log("Error getting recipes", error)
    }
  }

  useEffect(() => {
    getMostLikedRecipes()
  }, [])

  return (
    <div className="mt-5">
      <div className="container mx-auto mb-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="flex items-center mb-8 lg:mb-0">
            <div className="sidebar w-5 h-12 bg-primary"></div>
            <p className="ml-4 font-bold text-2xl text-center lg:text-left">
              Most Liked
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto flex flex-wrap  gap-4">
        {mostLiked.map((recipe) => (
          <RecipeCard key={recipe.id} recipeDetails={recipe} />
        ))}
      </div>
    </div>
  )
}

export default MostLiked
