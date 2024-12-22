import React from "react"
import { FaRegHeart } from "react-icons/fa"
import { FaEye } from "react-icons/fa"
import { TfiCommentAlt } from "react-icons/tfi"
import Transition from "../Transition"
import { Link } from "react-router-dom"

import RecipeCardSkeleton from "../../loadingSkeletons/CardSkeletion"

const RecipeCard = ({ loading, recipeDetails }) => {
  // console.log(recipeDetails)
  return (
    <>
      {loading ? (
        <RecipeCardSkeleton />
      ) : (
        <Transition key={recipeDetails.id}>
          <Link to={`/recipe/${recipeDetails.slug}`}>
            <div
              className={`bg-white shadow-lg rounded-lg overflow-hidden w-80 mx-auto cursor-pointer hover:shadow-2xl transition-shadow duration-500`}
            >
              <img
                src={recipeDetails?.image}
                alt="recipe-image"
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="p-4">
                <h2 className="text-2xl font-bold text-primary mb-2">
                  {recipeDetails?.title}
                </h2>

                <div className="mb-4">
                  <p
                    className={`text-m ${
                      recipeDetails?.type.toLowerCase() === "vegetarian"
                        ? "text-green-600"
                        : "text-orange-600"
                    } font-semibold`}
                  >
                    {recipeDetails?.type}
                  </p>
                  <p className="mt-2 text-sm text-gray-500 font-semibold">
                    {recipeDetails?.categories.map((category, index) => (
                      <span
                        key={index}
                        className="text-black bg-purple-200 px-2 py-1 rounded-full text-xs mr-1"
                      >
                        {category}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
              <div className="flex justify-around items-center bg-gray-100 py-2">
                <p className="flex items-center text-gray-600 font-bold">
                  <FaEye className="mr-1 text-primary" />
                  {recipeDetails?.views > 0 ? recipeDetails?.views : 0}
                </p>
                <p className="flex items-center text-gray-600 font-bold">
                  <FaRegHeart className="mr-1 text-primary" />
                  {recipeDetails?.likeCounts ? recipeDetails?.likeCounts : 0}
                </p>
                <p className="flex items-center text-gray-600 font-bold">
                  <TfiCommentAlt className="mr-1 text-primary" />
                  {recipeDetails?.rating ? recipeDetails?.rating.length : 0}
                </p>
              </div>
            </div>
          </Link>
        </Transition>
      )}
    </>
  )
}

export default RecipeCard
