import React, { useContext, useState } from "react"
import {
  FaHeart,
  FaRegHeart,
  FaEye,
  FaStar,
  FaClipboardList,
} from "react-icons/fa"
import { FaBookmark } from "react-icons/fa"
import { TfiCommentAlt } from "react-icons/tfi"
import { IoIosList } from "react-icons/io"
import { TiTick } from "react-icons/ti"
import { FaArrowRightLong } from "react-icons/fa6"
import { FaRegBookmark } from "react-icons/fa6"
import { MdOutlineDescription } from "react-icons/md"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"

import Rating from "@mui/material/Rating"
import Box from "@mui/material/Box"
import StarIcon from "@mui/icons-material/Star"

import Avatar from "@mui/material/Avatar"
import Stack from "@mui/material/Stack"
import { LoginContext } from "./LoginContext"
import RecipeShare from "./RecipeShare"

// for login checking

const RecipePage = ({ recipe, user }) => {
  const [value, setValue] = React.useState(2) // for rating star
  const [hover, setHover] = React.useState(-1)

  //login user detail
  const { isLoggedIn, userBasicInfo } = useContext(LoginContext)
  const navigate = useNavigate()

  const [userReview, setUserReview] = useState("")
  const [commentLoading, setCommentLoading] = useState(false)

  const averageRating =
    recipe?.ratings && recipe?.ratings.length > 0
      ? recipe.ratings.reduce((acc, r) => acc + r.rating, 0) /
        recipe.ratings.length
      : 0

  if (!recipe || !user) {
    return <div className="text-center p-4">Loading...</div>
  }

  const labels = {
    0.5: "Useless",
    1: "Useless+",
    1.5: "Poor",
    2: "Poor+",
    2.5: "Ok",
    3: "Ok+",
    3.5: "Good",
    4: "Good+",
    4.5: "Excellent",
    5: "Excellent+",
  }

  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`
  }

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

  const handleLike = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to like the recipe.")
      return navigate(`/login?redirect=/recipe/${recipe?.slug}`)
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/recipe/like-recipe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userId: userBasicInfo?._id,
            recipeId: recipe?._id,
          }),
        }
      )
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    }
  }

  const handleBookmark = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to bookmark the recipe.")
      navigate(`/login?redirect=recipe/${recipe?.slug}`)
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/recipe/save-recipe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userId: userBasicInfo?._id,
            recipeId: recipe?._id,
          }),
        }
      )
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    }
  }

  const handleComment = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to comment on the recipe.")
      navigate(`/login?redirect=recipe/${recipe?.slug}`)
    }
    if (userReview === "") {
      toast.error("Please add a comment.")
      return
    }
    try {
      setCommentLoading(true)
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/recipe/new-rating`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userId: userBasicInfo?._id,
            recipeId: recipe?._id,
            rating: value,
            comment: userReview,
          }),
        }
      )
      const data = await response.json()
      if (data.success) {
        toast.success("Comment added successfully.")
        setUserReview("")
        setCommentLoading(false)
      } else {
        toast.error(data.message)
        setCommentLoading(false)
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
      setCommentLoading(false)
    }
  }

  const recipeUrl = `${window.location.origin}/recipe/${recipe.slug}`

  return (
    <div className="w-full px-4 py-6 max-w-full mx-auto bg-white">
      {/* breadcrumb  */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm font-medium text-secondary hover:text-primary"
            >
              <svg
                className="w-3 h-3 me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <svg
                className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <Link
                href="#"
                className="ms-1 text-sm font-medium text-secondary hover:text-primary"
              >
                {recipe.title}
              </Link>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col md:flex-row md:space-x-8 mb-6 mt-6">
        <div className="flex-shrink-0 mb-6 md:mb-0">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-80 object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h1 className="text-4xl font-bold text-primary mb-3">
              {recipe.title}
            </h1>
            {/* action buttons  */}
            <div className="flex gap-2">
              {recipe?.likes.includes(userBasicInfo?._id) ? (
                <Tooltip title="Unlike">
                  <IconButton
                    onClick={() => {
                      handleLike()
                    }}
                  >
                    <FaHeart className="w-9 h-9 text-primary " />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Like">
                  <IconButton
                    onClick={() => {
                      handleLike()
                    }}
                  >
                    <FaRegHeart className="w-9 h-9 text-secondary " />
                  </IconButton>
                </Tooltip>
              )}

              {recipe?.saved.includes(userBasicInfo?._id) ? (
                <Tooltip title="UnSave">
                  <IconButton
                    onClick={() => {
                      handleBookmark()
                    }}
                  >
                    <FaBookmark className="w-9 h-9 text-primary " />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Save">
                  <IconButton
                    onClick={() => {
                      handleBookmark()
                    }}
                  >
                    <FaRegBookmark className="w-9 h-9 text-secondary " />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </div>
          <p className="text-lg text-gray-700 mb-4">{recipe.summary}</p>
          <div className="text-sm text-gray-600 mb-4 flex flex-wrap gap-2">
            {recipe?.categories.map((category, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
          <div className="flex gap-4 items-center mb-4 text-gray-700">
            <div className="flex items-center">
              <FaEye className="text-primary mr-1" />
              <span>{recipe?.views}</span>
            </div>
            <div className="flex items-center">
              <FaRegHeart className="text-primary mr-1" />
              <span>{recipe?.likes.length}</span>
            </div>
            <div className="flex items-center">
              <TfiCommentAlt className="text-primary mr-1" />
              <span>{recipe?.ratings ? recipe?.ratings.length : 0}</span>
            </div>
          </div>
          <div className="mb-6">
            <span className="flex gap-1 items-center text-lg font-semibold">
              <FaStar className="text-primary" />
              {recipe?.ratings ? averageRating.toFixed(1) : 0} - (
              {recipe?.ratings ? recipe?.ratings.length : 0} reviews)
            </span>
          </div>
          {/* User Details */}
          <Link
            to={`/view-user/profile?uid=${user?._id}`}
            className="flex items-center gap-4 mb-6 cursor-pointer "
          >
            {user?.profilePicture ? (
              <Avatar
                alt="Profile Picture"
                style={{ width: "35px", height: "35px", objectFit: "cover" }}
                src={user?.profilePicture}
              />
            ) : (
              <Stack direction="row" spacing={1}>
                <Avatar
                  style={{ width: "35px", height: "35px" }}
                  {...stringAvatar(user?.username || "User")}
                />
              </Stack>
            )}

            <div className="hover:underline">
              <h2 className="text-lg font-semibold text-primary ">
                {user?.username}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </Link>
          <RecipeShare recipeUrl={recipeUrl} recipeTitle={recipe.title} />
        </div>
      </div>

      <div className="border-t border-b border-gray-300 mb-6"></div>

      <div>
        <div className="mb-6">
          <h2 className="flex gap-2 items-center text-2xl font-semibold text-primary mb-3">
            <MdOutlineDescription className="text-primary" />
            About {recipe?.title}
          </h2>
          <p className="text-lg text-gray-800">{recipe?.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="flex gap-2 items-center text-2xl font-semibold text-primary mb-3">
            <IoIosList className="text-primary" />
            Ingredients
          </h2>
          <ul className="list-disc list-inside space-y-2">
            {recipe?.ingredients.map((ingredient, index) => (
              <li key={index} className="text-gray-700 flex items-center">
                <TiTick className="text-primary mr-2" />
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="flex gap-2 items-center text-2xl font-semibold text-primary mb-3">
            <FaClipboardList className="text-primary" />
            Method
          </h2>
          <ol className="list-decimal list-inside space-y-2">
            {recipe?.method.map((step, index) => (
              <li key={index} className="text-gray-700 flex items-center">
                <span className="mr-2">Step {index + 1}</span>
                <FaArrowRightLong className="text-primary" />
                <span className="ml-2">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* review part   */}
        <div className="mb-6 shadow-lg p-5">
          <h2 className="text-xl font-medium text-primary mb-4">
            Give Your Review
          </h2>
          <div>
            <Box
              sx={{
                width: 200,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Rating
                name="hover-feedback"
                value={value}
                precision={0.5}
                getLabelText={getLabelText}
                onChange={(event, newValue) => {
                  setValue(newValue)
                }}
                onChangeActive={(event, newHover) => {
                  setHover(newHover)
                }}
                emptyIcon={
                  <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                }
              />
              {value !== null && (
                <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
              )}
            </Box>
          </div>

          <div className="flex items-center gap-4 mb-4"></div>

          <div className="flex items-start gap-3 mb-4">
            {user?.profilePicture ? (
              <Avatar
                alt="Profile Picture"
                style={{ width: "25px", height: "25px", objectFit: "cover" }}
                src={userBasicInfo?.profilePicture}
              />
            ) : (
              <Stack direction="row" spacing={1}>
                <Avatar
                  style={{ width: "25px", height: "25px" }}
                  {...stringAvatar(userBasicInfo?.username || "User")}
                />
              </Stack>
            )}
            <div className="flex-1">
              <textarea
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                onChange={(e) => setUserReview(e.target.value)}
                placeholder="Add your review here..."
              ></textarea>
              <button
                className="bg-primary text-white px-3 py-1 rounded mt-2 hover:bg-primary-dark transition-colors"
                disabled={commentLoading}
                onClick={() => {
                  handleComment()
                }}
              >
                {commentLoading ? "Adding..." : "Add Review"}
              </button>
            </div>
          </div>
          <h2 className="text-xl font-medium text-primary mb-4">
            Comments ({recipe?.ratings ? recipe?.ratings.length : 0})
          </h2>

          <div className="space-y-3">
            {recipe?.ratings ? (
              recipe?.ratings.map((data, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 rounded shadow-sm bg-white"
                >
                  {data?.userId && (
                    <div className="flex items-center gap-3">
                      {data?.userId?.profilePicture ? (
                        <Avatar
                          alt="Profile Picture"
                          style={{
                            width: "20px",
                            height: "20px",
                            objectFit: "cover",
                          }}
                          src={data?.userId?.profilePicture}
                        />
                      ) : (
                        <Stack direction="row" spacing={1}>
                          <Avatar
                            style={{ width: "20px", height: "20px" }}
                            {...stringAvatar(data?.userId?.username || "User")}
                          />
                        </Stack>
                      )}
                      <div>
                        <h2 className="text-lg font-semibold text-primary">
                          {data?.userId?.username}
                        </h2>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="flex justify-center items-center font-semibold">
                      (<FaStar className="text-primary" />{" "}
                      <span className="text-primary-dark">{data?.rating}</span>)
                    </span>
                    <p className="text-gray-800">{data.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipePage
