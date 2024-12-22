import React, { useEffect, useState } from "react"

// import { Rating } from 'react-simple-star-rating'; // Add this if you want to use a rating component

import users from "../data/users.json"

import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import RecipePage from "../components/RecipePage"
import FetchErrorPage from "../components/FetchErrorPage"
import { Spinner } from "../components/loader"

const Recipe = () => {
  const [recipe, setRecipe] = useState(null) // Initial state is null

  const [user, setUser] = useState(null)
  const [fetchError, setFetchError] = useState(false)
  const [loading, setLoading] = useState(false)
  const { slug } = useParams()

  const getRecipeFromSlug = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/recipe/get-single-recipe/${slug}`
      )
      const data = await response.json()
      if (data.success) {
        setRecipe(data.recipe)
        setUser(data.recipe.userId)
        setFetchError(false)
        setLoading(false)
      } else {
        console.log(data.message)
        setFetchError(true)
        setLoading(false)
      }
    } catch (error) {
      console.log("Somthing went wrong, Try again", error)
      setFetchError(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    getRecipeFromSlug()
  }, [slug])

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
          <RecipePage recipe={recipe} user={user} />
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Recipe
