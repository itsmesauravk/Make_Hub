import React, { useContext, useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import users from "../data/users.json"
import recipes from "../data/recipes.json"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

import toast from "react-hot-toast"
import RecipeCard from "../components/recipe/cards"
import FetchErrorPage from "../components/FetchErrorPage"

import { Spinner } from "../components/loader"

//for avatar
import Avatar from "@mui/material/Avatar"
import Stack from "@mui/material/Stack"
import { LoginContext } from "../components/LoginContext"

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null)
  const [userRecipes, setUserRecipes] = useState([])
  const [fetchError, setFetchError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  //getting user info
  const { isLoggedIn, userBasicInfo } = useContext(LoginContext)

  // console.log(userBasicInfo)
  const navigate = useNavigate()

  const location = useLocation()

  const getUid = () => {
    return new URLSearchParams(location.search).get("uid")
  }

  const uid = getUid()

  const getUser = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/inspect-user/${uid}`
      )
      const data = await response.json()
      if (data.success) {
        setUserProfile(data.user)
        setUserRecipes(data.user.recipesPosted)
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

  const getUserRecipes = () => {
    const filteredRecipes = recipes.filter(
      (recipe) => recipe.userId === parseInt(uid)
    )
    setUserRecipes(filteredRecipes)
  }

  useEffect(() => {
    if (uid) {
      getUser()
      getUserRecipes()
    }
  }, [])

  //for avatar
  function stringToColor(string) {
    let hash = 0
    let i

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = "#"

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }
    /* eslint-enable no-bitwise */

    return color
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}`,
    }
  }

  // follow-unfollow
  const handleFollowUnfollow = async (event) => {
    event.preventDefault()
    if (!isLoggedIn) {
      toast.error("Please login to follow user")
      return navigate(`/login?redirect=${location.pathname}?uid=${uid}`)
    }

    try {
      setFollowLoading(true)
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/follow-unfollow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userBasicInfo._id, //logged in user id (follower)
            followId: userProfile._id, //user id of the user to be followed
          }),
        }
      )
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
        setFollowLoading(false)
        getUser()
      } else {
        toast.error(data.message)
        setFollowLoading(false)
      }
    } catch (error) {
      console.error("Error following user", error)
      toast.error("Unable to follow user")
      setFollowLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      {/* Fetch Error */}
      {fetchError && <FetchErrorPage />}
      <div className="flex flex-col gap-10 items-center my-auto w-3/4 mx-auto mt-28">
        {/* Loading State */}
        {loading ? (
          <Spinner
            width={"50px"}
            height={"50px"}
            backgroundColor={"#F3043A"}
            padding={"4px"}
          />
        ) : (
          <>
            {/* User Profile Section */}
            {userProfile && (
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center md:items-start  w-full">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  {userProfile?.profilePicture ? (
                    <Avatar
                      alt="Profile Picture"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                      src={userProfile?.profilePicture}
                    />
                  ) : (
                    <Stack direction="row" spacing={1}>
                      <Avatar
                        style={{ width: "150px", height: "150px" }}
                        {...stringAvatar(userProfile?.username || "User")}
                      />
                    </Stack>
                  )}
                </div>

                {/* Profile Details */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-4xl font-bold text-primary mb-2">
                    {userProfile?.username}{" "}
                    <span className="text-lg text-primary-dark">
                      (@{userProfile?.fullname})
                    </span>
                  </h2>
                  <p className="text-gray-600 mb-4">{userProfile.email}</p>
                  <p className="text-gray-800 mb-6 ">{userProfile.bio}</p>

                  <div className="flex justify-around md:justify-start gap-8 mb-6">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-700">
                        Followers
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {userProfile.followers.length}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-700">
                        Following
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {userProfile.following.length}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-700">
                        Recipes
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {userProfile.recipesPosted.length}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full md:w-auto bg-primary text-white py-2 px-6 rounded-full hover:bg-primary-dark transition-colors"
                    onClick={handleFollowUnfollow}
                  >
                    {followLoading && (
                      <Spinner
                        width={"20px"}
                        height={"20px"}
                        backgroundColor={"#fff"}
                        padding={"2px"}
                      />
                    )}
                    {userProfile.followers.includes(userBasicInfo._id)
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-300 w-full"></div>

            {/* User Recipes Section */}
            <div className="w-full">
              <h2 className="text-3xl font-semibold text-primary mb-6">
                {userProfile?.username}'s Recipes
              </h2>
              {userRecipes.length === 0 && (
                <p className="text-center text-gray-600">
                  {userProfile?.username} has not posted any recipes yet.
                </p>
              )}

              <div className="container mx-auto flex flex-wrap  gap-4">
                {userRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipeDetails={recipe} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default UserProfile
