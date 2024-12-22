import React, { useContext, useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { FaSearch } from "react-icons/fa"
import { LoginContext } from "../components/LoginContext"
import Tooltip from "@mui/material/Tooltip"

//for avatar
import Avatar from "@mui/material/Avatar"
import Stack from "@mui/material/Stack"
import { Link, useLocation, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Spinner } from "../components/loader"
import Transition from "../components/Transition"

const FindUser = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const { isLoggedIn, userBasicInfo } = useContext(LoginContext)
  const navigate = useNavigate()
  const [followLoading, setFollowLoading] = useState(false)
  const location = useLocation()
  const [userName, setUserName] = useState("")

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

  const getUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/get-popular-users`
      )
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
        setLoading(false)
      }
    } catch (error) {
      console.log("Error on getting users", error)
      setLoading(false)
    }
  }

  const handleSearchUser = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/find-users?term=${userName}`
      )
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
        setLoading(false)
      } else {
        toast.error(data.message)
        setLoading(false)
      }
    } catch (error) {
      console.log("Error viewing user profile:", error)
      toast.error("Unable to find user")
      setLoading(false)
    }
  }

  // follow-unfollow
  const handleFollowUnfollow = async (event, userId) => {
    event.preventDefault()
    if (!isLoggedIn) {
      toast.error("Please login to follow user")
      return navigate(`/login?redirect=${location.pathname}`)
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
            followId: userId, //user id of the user to be followed
          }),
        }
      )
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
        setFollowLoading(false)
        getUsers()
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

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div
        className="container mx-auto px-4 py-8 mt-20 flex-grow"
        style={{ maxWidth: "70%" }}
      >
        {/* Search bar section */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search for users..."
            className="w-full max-w-lg px-4 py-2 border rounded-l-lg focus:outline-none"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
          />
          <Tooltip title="Search" arrow>
            <button
              onClick={handleSearchUser}
              className="px-4 py-2 bg-primary text-white rounded-r-lg"
            >
              <FaSearch />
            </button>
          </Tooltip>
        </div>

        <h1 className="text-2xl font-bold text-center mb-4 mt-20">
          Popular Users
        </h1>

        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <Spinner
              width={"50px"}
              height={"50px"}
              backgroundColor={"#F3043A"}
              padding={"4px"}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="font-semibold text-xl">
              Search result for "
              <span className="text-primary-dark italic ">{userName}</span>"
            </p>

            {users.map((user) => (
              <Transition>
                <div
                  key={user.id}
                  className="flex items-center bg-white shadow-md rounded-lg p-4 space-x-4 hover:shadow-lg hover:cursor-pointer"
                >
                  {user?.profilePicture ? (
                    <Avatar
                      alt="Profile Picture"
                      style={{
                        width: "25px",
                        height: "25px",
                        objectFit: "cover",
                      }}
                      src={user?.profilePicture}
                    />
                  ) : (
                    <Stack direction="row" spacing={1}>
                      <Avatar
                        style={{ width: "25px", height: "25px" }}
                        {...stringAvatar(user.username || "User")}
                      />
                    </Stack>
                  )}
                  <div className="flex-grow">
                    <p className="text-lg font-medium">{user.username}</p>
                    <p className="text-sm text-gray-500">
                      {user.recipesPosted.length} Recipes •{" "}
                      {user.followers.length} Followers
                    </p>
                  </div>

                  <div className="flex gap-3 justify-center items-center">
                    {user?._id !== userBasicInfo?._id ? (
                      <Tooltip title="View Profile" arrow>
                        <Link
                          to={`/view-user/profile?uid=${user?._id}`}
                          className=" "
                        >
                          <button className="px-4 py-2 rounded border border-primary-dark">
                            View
                          </button>
                        </Link>
                      </Tooltip>
                    ) : (
                      <Tooltip title="My Account" arrow>
                        <Link to={`/my-account/${userBasicInfo?.slug}`}>
                          <button className="px-4 py-2 rounded border  bg-primary text-white ">
                            Profile
                          </button>
                        </Link>
                      </Tooltip>
                    )}

                    {user?._id !== userBasicInfo?._id && (
                      <Tooltip
                        title={
                          user?.followers.includes(userBasicInfo._id)
                            ? "UnFollow"
                            : "Follow"
                        }
                        arrow
                      >
                        <button
                          disabled={followLoading}
                          className={`px-4 py-2 rounded bg-primary text-white `}
                          onClick={(event) =>
                            handleFollowUnfollow(event, user._id)
                          }
                        >
                          {user?.followers.includes(userBasicInfo._id)
                            ? "Following"
                            : "Follow"}
                        </button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </Transition>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default FindUser
