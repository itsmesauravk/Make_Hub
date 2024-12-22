import React from "react"
import { Link } from "react-router-dom"
import TopRecipesSkeleton from "../../loadingSkeletons/TopicRecipeSkeletion"

const TopRecipes = ({ loading, title, description, image, slug }) => {
  return (
    <>
      {loading ? (
        <TopRecipesSkeleton />
      ) : (
        <div
          className="relative flex max-w-sm rounded overflow-hidden shadow-lg m-4"
          style={{
            height: "350px",
            width: "300px",
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute  bottom-0 left-0 w-full h-[45%] bg-primary bg-opacity-55 text-white flex flex-col items-baseline justify-end px-6 py-4 transition-all duration-300 ease-in-out group hover:h-full hover:justify-center">
            <div className="flex flex-col justify-center items-center px-6 py-4 group-hover:flex group-hover:flex-col group-hover:justify-center transition-all duration-300 ease-in-out">
              <div className="font-bold text-4xl mb-2">{title}</div>
              <p className="text-base">{description}</p>
            </div>
            <div className="flex justify-center items-center px-6 pt-4 pb-2">
              <Link
                to={`/recipe/${slug}`}
                className="bg-white text-primary font-bold py-2 px-4 rounded-full hover:bg-secondary hover:text-white transition-all duration-300 ease-in-out"
              >
                View Recipe
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TopRecipes
