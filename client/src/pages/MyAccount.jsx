import React, { useContext, useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

import Box from "@mui/material/Box"
import Tab from "@mui/material/Tab"
import TabContext from "@mui/lab/TabContext"
import TabList from "@mui/lab/TabList"
import TabPanel from "@mui/lab/TabPanel"

import RecipeCard from "../components/recipe/cards"

import toast from "react-hot-toast"

import { Spinner } from "../components/loader"

import { MdModeEdit } from "react-icons/md"
import EditProfile from "../components/EditProfile"

import { LoginContext } from "../components/LoginContext"
import { Link } from "react-router-dom"

import { MdOutlineLogout } from "react-icons/md"
import { MdDelete } from "react-icons/md"

import Tooltip from "@mui/material/Tooltip"

const MyAccount = () => {
  const [value, setValue] = useState("1")
  const [myRecipe, setMyRecipe] = useState([])
  const [myLiked, setMyLiked] = useState([])
  const [mySaved, setMySaved] = useState([])

  const [profileLoading, setProfileLoading] = useState(false)
  const [recipeLoading, setRecipeLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const { userBasicInfo } = useContext(LoginContext)

  const [userProfile, setUserProfile] = useState({})

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)
  const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false)

  const handleOpenEditProfileModal = () => setIsEditProfileModalOpen(true)
  const handleCloseEditProfileModal = () => setIsEditProfileModalOpen(false)

  const handleOpenAddRecipeModal = () => setIsAddRecipeModalOpen(true)
  const handleCloseAddRecipeModal = () => setIsAddRecipeModalOpen(false)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  //getting user info
  const getUserProfile = async () => {
    try {
      setProfileLoading(true)
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/user-profile/${userBasicInfo.slug}`,
        {
          method: "GET",
        }
      )
      const data = await response.json()
      if (data.success) {
        setUserProfile(data.user)
        setProfileLoading(false)
      }
    } catch (error) {
      console.log("Error getting user profile", error)
      setProfileLoading(false)
    }
  }

  //for getting recipes (dynamic route)

  const getRecipes = async (type) => {
    try {
      setRecipeLoading(true)
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/recipe/get-recipes/${userBasicInfo._id}?type=${type}`,
        {
          method: "GET",
        }
      )
      const data = await response.json()
      if (data.success) {
        if (type === "my-recipes") {
          setMyRecipe(data.user.recipesPosted)
          setRecipeLoading(false)
        } else if (type === "my-likes") {
          setMyLiked(data.user.myLikes)
          setRecipeLoading(false)
        } else if (type === "my-saved") {
          setMySaved(data.user.mySaved)
          setRecipeLoading(false)
        }
      } else {
        console.log("Error getting recipes")
        setRecipeLoading(false)
      }
    } catch (error) {
      console.log("Error getting recipes", error)
      setRecipeLoading(false)
    }
  }

  const handleLogout = () => {
    // logout user
    const confirmLogout = window.confirm("Are you sure you want to logout?")
    if (confirmLogout) {
      // logout user
      localStorage.removeItem("token")
      window.location.href = "/"
    }
  }

  //delete recipe
  const deleteRecipe = async (e, recipeId) => {
    e.preventDefault()

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?"
    )
    if (!confirmDelete) return

    try {
      setDeleteLoading(true)

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/recipe/delete-recipe/${recipeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )

      const data = await response.json()
      console.log(data)

      if (data.success) {
        toast.success(data.message || "Recipe deleted successfully")
        getRecipes("my-recipes")
        setDeleteLoading(false)
      } else {
        toast.error(data.message || "Failed to delete recipe")
        setDeleteLoading(false)
      }
    } catch (error) {
      toast.error("An error occurred while deleting the recipe.")
      setDeleteLoading(false)
    } finally {
      setDeleteLoading(false)
    }
  }

  useEffect(() => {
    getUserProfile()

    // getMyRecipe()
    // getMyLiked()
    // getMySaved()
    getRecipes("my-recipes")
  }, [userBasicInfo.slug])

  // console.log(userProfile)

  return (
    <div>
      <Navbar />
      <div className="flex flex-col gap-10 items-center my-auto w-11/12 md:w-3/4 mx-auto mt-20">
        {userProfile && (
          // <div>
          <>
            {/* Profile Section */}
            {profileLoading ? (
              <Spinner
                width={"25px"}
                height={"25px"}
                backgroundColor={"#f3043a"}
                padding={"3px"}
              />
            ) : (
              <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                {/* Profile Image */}
                <div className="flex justify-center md:justify-start w-full md:w-1/4">
                  {userProfile?.profilePicture ? (
                    <img
                      src={userProfile?.profilePicture}
                      alt="user-profile"
                      className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src={
                        "https://freedesignfile.com/upload/2019/11/Professionals-cook-vector.jpg"
                      }
                      alt="user-profile"
                      className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover"
                    />
                  )}
                </div>
                {/* Profile Info */}
                <div className="flex flex-col w-full md:w-3/4">
                  <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
                    <h2 className="text-2xl font-semibold text-primary">
                      {userProfile?.fullname}
                    </h2>
                    <div className="flex gap-2">
                      <Link
                        to={`/my-account/${userBasicInfo?.slug}/create-recipe`}
                      >
                        <button
                          onClick={handleOpenAddRecipeModal}
                          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-all"
                        >
                          Add Recipe
                        </button>
                      </Link>
                      <button
                        onClick={handleOpenEditProfileModal}
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-all"
                      >
                        Edit Profile
                      </button>
                      <EditProfile
                        isOpen={isEditProfileModalOpen}
                        onClose={handleCloseEditProfileModal}
                        userDetails={userProfile}
                      />

                      <button
                        onClick={() => handleLogout()}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all"
                      >
                        Log Out
                        <MdOutlineLogout className="inline-block ml-2" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4 font-bold">
                    <p>
                      {userProfile?.recipesPosted?.length}{" "}
                      <strong>recipes</strong>
                    </p>
                    <p>
                      {userProfile?.following?.length}{" "}
                      <strong>following</strong>
                    </p>
                    <p>
                      {userProfile?.followers?.length}{" "}
                      <strong>followers</strong>
                    </p>
                  </div>
                  <p className="text-sm text-secondary mt-2">
                    {userProfile?.bio ? userProfile?.bio : "No bio available"}
                  </p>
                </div>
              </div>
            )}

            {/* Tabs for Recipes, Liked, and Saved */}
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList onChange={handleChange} aria-label="user tabs">
                    <Tab
                      onClick={() => getRecipes("my-recipes")}
                      label="My Recipes"
                      value="1"
                    />
                    <Tab
                      onClick={() => getRecipes("my-likes")}
                      label="Liked Recipes"
                      value="2"
                    />
                    <Tab
                      onClick={() => getRecipes("my-saved")}
                      label="Saved Recipes"
                      value="3"
                    />
                  </TabList>
                </Box>

                <TabPanel value="1">
                  {recipeLoading && (
                    <Spinner
                      width={"18px"}
                      height={"18px"}
                      backgroundColor={"#f3043a"}
                      padding={"2px"}
                    />
                  )}
                  <div className="flex flex-wrap gap-6">
                    {myRecipe.length === 0 && (
                      <div className="w-full text-center text-lg text-secondary">
                        No recipes found, Try Adding Your First Recipe
                      </div>
                    )}
                    {myRecipe.length > 0 &&
                      myRecipe.map((recipe) => (
                        <div key={recipe._id} className="relative">
                          <RecipeCard recipeDetails={recipe} />
                          <Tooltip title="Edit" arrow>
                            <Link
                              to={`/edit-recipe/${recipe.slug}`}
                              className="absolute top-2 right-14 bg-white p-3 rounded-full shadow-md "
                              onClick={() => {
                                toast.success(recipe.slug)
                              }}
                            >
                              <MdModeEdit className="text-primary hover:text-blue-600" />
                            </Link>
                          </Tooltip>
                          <Tooltip title="Delete" arrow>
                            <button
                              className="absolute top-2 right-2 bg-white p-3 rounded-full shadow-md "
                              disabled={deleteLoading}
                              onClick={(e) => {
                                deleteRecipe(e, recipe._id)
                              }}
                            >
                              <MdDelete className="text-primary hover:text-red-600" />
                            </button>
                          </Tooltip>
                        </div>
                      ))}
                  </div>
                </TabPanel>

                <TabPanel value="2">
                  {recipeLoading && (
                    <Spinner
                      width={"18px"}
                      height={"18px"}
                      color={"#f3043a"}
                      padding={"2px"}
                    />
                  )}
                  <div className="flex flex-wrap gap-6">
                    {myLiked.length === 0 && (
                      <div className="w-full text-center text-lg text-secondary">
                        No recipes found, Try Liking Some Recipes
                      </div>
                    )}

                    {myLiked.length > 0 &&
                      myLiked.map((recipe) => (
                        <RecipeCard
                          key={recipe.recipeId}
                          recipeDetails={recipe}
                        />
                      ))}
                  </div>
                </TabPanel>

                <TabPanel value="3">
                  {recipeLoading && (
                    <Spinner
                      width={"18px"}
                      height={"18px"}
                      color={"#f3043a"}
                      padding={"2px"}
                    />
                  )}
                  <div className="flex flex-wrap gap-6">
                    {mySaved.length === 0 && (
                      <div className="w-full text-center text-lg text-secondary">
                        No recipes found, Try Saving Some Recipes
                      </div>
                    )}

                    {mySaved.length > 0 &&
                      mySaved.map((recipe) => (
                        <RecipeCard
                          key={recipe.recipeId}
                          recipeDetails={recipe}
                        />
                      ))}
                  </div>
                </TabPanel>
              </TabContext>
            </Box>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default MyAccount
