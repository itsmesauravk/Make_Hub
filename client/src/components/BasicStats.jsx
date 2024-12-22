import React, { useEffect, useState } from "react"
import { FaCookieBite } from "react-icons/fa"
import { FaUsers } from "react-icons/fa"
import { IoFastFood } from "react-icons/io5"
import { BiSolidFoodMenu } from "react-icons/bi"
import Transition from "./Transition"

const BasicStats = () => {
  const [statsCount, setStatsCount] = useState({})

  const getStats = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/recipe/basic-stats`
      )
      const data = await response.json()
      if (data.success) {
        setStatsCount(data.data)
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log("Error getting stats", error)
    }
  }

  useEffect(() => {
    getStats()
  }, [])

  return (
    <div>
      <section class="text-gray-600 body-font">
        <div class="container px-5 py-24 mx-auto">
          <div class="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-3xl text-2xl font-semibold title-font mb-4 text-primary-dark">
              Explore Our Diverse Recipe Collection
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Discover a variety of delicious recipes crafted with passion and
              precision. Whether you're looking for quick meals, exotic dishes,
              or healthy options, our collection has something for every taste
              and occasion.
            </p>
          </div>

          <div class="flex flex-wrap -m-4 text-center">
            <div class="p-4 md:w-1/4 sm:w-1/2 w-full">
              <Transition>
                <div class="flex flex-col justify-center items-center gap-3 border-2 border-gray-200 px-4 py-6 rounded-lg">
                  <BiSolidFoodMenu className="text-primary-dark w-10 h-10" />
                  <h2 class="title-font font-medium text-3xl text-gray-900">
                    {statsCount ? (
                      <span>{statsCount?.totalRecipes - 1}+</span>
                    ) : (
                      0
                    )}
                  </h2>
                  <p class="leading-relaxed">Recipes</p>
                </div>
              </Transition>
            </div>
            <div class="p-4 md:w-1/4 sm:w-1/2 w-full">
              <Transition>
                <div class="flex flex-col justify-center items-center gap-3 border-2 border-gray-200 px-4 py-6 rounded-lg">
                  <FaUsers className="text-primary-dark w-10 h-10" />
                  <h2 class="title-font font-medium text-3xl text-gray-900">
                    {statsCount ? (
                      <span>{statsCount?.totalUsers - 1}+</span>
                    ) : (
                      0
                    )}
                  </h2>
                  <p class="leading-relaxed">Users</p>
                </div>
              </Transition>
            </div>
            <div class="p-4 md:w-1/4 sm:w-1/2 w-full">
              <Transition>
                <div class="flex flex-col justify-center items-center gap-3 border-2 border-gray-200 px-4 py-6 rounded-lg">
                  <IoFastFood className="text-primary-dark w-10 h-10" />
                  <h2 class="title-font font-medium text-3xl text-gray-900">
                    {statsCount ? (
                      <span>{statsCount?.totalTypes - 1}+</span>
                    ) : (
                      0
                    )}
                  </h2>
                  <p class="leading-relaxed">Types</p>
                </div>
              </Transition>
            </div>
            <div class="p-4 md:w-1/4 sm:w-1/2 w-full">
              <Transition>
                <div class="flex flex-col justify-center items-center gap-3 border-2 border-gray-200 px-4 py-6 rounded-lg">
                  <FaCookieBite className="text-primary-dark w-10 h-10" />

                  <h2 class="title-font font-medium text-3xl text-gray-900">
                    {statsCount ? (
                      <span>{statsCount?.totalCategories - 1}+</span>
                    ) : (
                      0
                    )}
                  </h2>
                  <p class="leading-relaxed">Categories</p>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BasicStats
