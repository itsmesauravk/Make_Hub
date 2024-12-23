import React, { useContext, useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import TopRecipes from "../components/recipe/TopRecipes"
import Transition from "../components/Transition"
import PopularRecipe from "../components/PopularRecipe"
import MostLiked from "../components/MostLiked"
import BasicStats from "../components/BasicStats"
import ChatBot from "../components/ChatBot"
import { RecipeContext } from "../components/RecipeContext"

const Homepage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const { setTotalRecipes } = useContext(RecipeContext)

  const queryParams = new URLSearchParams({
    page: 1,
    limit: 3,
    type: "all",
    category: "all",
    sort: "popular",
  }).toString()

  const getTopRecipes = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/recipe/filter-recipes?${queryParams}`
      )
      const data = await response.json()
      if (data.success) {
        setData(data.data)
        setTotalRecipes(data.totalRecipes)
        setLoading(false)
      } else {
        console.log(data.message)
        setLoading(false)
      }
    } catch (error) {
      console.log("Error getting recipes", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    getTopRecipes()
  }, [])

  return (
    <div>
      <Navbar />

      {/* Landing Image */}
      <div className="">
        <img
          className="max-h-screen w-full -z-10 object-cover"
          src="/images/landingImage.jpg"
          alt="Landing"
        />
      </div>

      <div className="flex flex-col gap-10 items-center w-3/4 mx-auto">
        {/* Top Recipes Section */}
        <div className="mt-10 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-5">
            <div className="flex items-center mb-8 lg:mb-0">
              <div className="w-5 h-12 bg-primary"></div>
              <p className="ml-4 font-bold text-2xl">
                Discover the top recipes <br /> available at us
              </p>
            </div>
            <p className="text-sm text-secondary max-w-lg text-center lg:text-left">
              Our recipes are curated by top chefs and food experts. We have a
              wide range of recipes from different cuisines. You can also create
              your own meal plan and get the ingredients delivered to your
              doorstep.
            </p>
          </div>

          {/* Top Recipes Cards */}
          <div className="flex flex-wrap items-center justify-between">
            {data &&
              data.map((recipe, index) => (
                <Transition key={index}>
                  <TopRecipes
                    loading={loading}
                    title={recipe.title}
                    description={recipe.summary}
                    image={recipe.image}
                    slug={recipe.slug}
                  />
                </Transition>
              ))}
          </div>
        </div>

        {/* basic stats  */}
        <BasicStats />

        {/* Popular Recipes */}
        <PopularRecipe />

        {/* most liked  */}
        <MostLiked />
        <ChatBot />
      </div>

      <Footer />
    </div>
  )
}

export default Homepage
