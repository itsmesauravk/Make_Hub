import React, { useContext, useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { IoFastFood, IoHeart, IoPersonAdd, IoChatbubble } from "react-icons/io5"
import { LoginContext } from "../components/LoginContext"
import { Spinner } from "../components/loader"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"

const Notification = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [notiVal, setNotiVal] = useState("6")
  const [showAll, setShowAll] = useState(false)

  const { isLoggedIn, userBasicInfo } = useContext(LoginContext)

  const handleGetNotifi = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/recipe/all-notifications/${userBasicInfo?._id}?limit=${notiVal}`
      )
      const data = await response.json()

      if (data.success) {
        setNotifications(data.data)
        setLoading(false)
      } else {
        setNotifications(false)
        console.log(data.message)
      }
    } catch (error) {
      console.log("Error while fetching notifications", error)
      setLoading(false)
    }
  }

  const handleMarkAsRead = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/recipe/mark-as-read/${userBasicInfo?._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      const data = await response.json()
      if (data.success) {
        handleGetNotifi()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log("Error while marking notifications as read", error)
    }
  }

  const handleShowNoti = () => {
    if (showAll) {
      setNotiVal("6")
      setShowAll(false)
    } else {
      setNotiVal("all")
      setShowAll(true)
    }
  }

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      handleGetNotifi()
    }, 1000)
  }, [notiVal])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {isLoggedIn ? (
        <div className="flex flex-col   container mx-auto px-4 py-8 mt-16 flex-grow items-center">
          <h1 className="text-4xl font-bold text-center mb-8">Notifications</h1>
          <div className="flex gap-x-44  justify-between items-center mb-10">
            <h2 className="text-2xl font-semibold">Earlier</h2>
            <button
              className="text-primary font-medium hover:underline"
              onClick={handleMarkAsRead}
            >
              Mark all as Read
            </button>
          </div>
          {loading ? (
            <Spinner
              width={"2rem"}
              height={"2rem"}
              backgroundColor={"#F3043A"}
              padding={"0.2rem"}
            />
          ) : (
            <>
              <div className="flex flex-col items-center justify-center mt-4 space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center w-full max-w-md bg-white shadow-md rounded-lg p-4 "
                    style={{
                      borderRight:
                        notification?.read === false
                          ? "4px solid #2E2265"
                          : "none",
                    }}
                  >
                    {/* like  */}
                    {notification?.type === "like" && (
                      <>
                        <div className="mr-4">
                          <IoHeart className="text-red-500 text-xl" />
                        </div>
                        <div className="flex-grow">
                          <p className="text-lg font-medium">
                            <Link
                              to={`/view-user/profile?uid=${notification?.sender?._id}`}
                              className="text-primary-dark hover:underline hover:cursor-pointer"
                            >
                              {notification?.sender?.username}
                            </Link>{" "}
                            likes your recipe{" "}
                            <Link
                              to={`/recipe/${notification?.recipe?.slug}`}
                              className="text-primary-dark hover:underline hover:cursor-pointer"
                            >
                              {" "}
                              {notification?.recipe?.title}
                            </Link>
                          </p>
                          <p className="text-sm text-gray-500">
                            {notification?.createdAt.split("T")[0]} at{" "}
                            {
                              notification?.createdAt
                                .split("T")[1]
                                .split(".")[0]
                            }
                          </p>
                        </div>
                      </>
                    )}
                    {/* new recipe  */}
                    {notification?.type === "newRecipe" && (
                      <>
                        <div className="mr-4">
                          <IoFastFood className="text-purple-500 text-xl" />
                        </div>
                        <div className="flex-grow">
                          <p className="text-lg font-medium">
                            <Link
                              to={`/view-user/profile?uid=${notification?.sender?._id}`}
                              className="text-primary-dark hover:underline hover:cursor-pointer"
                            >
                              {notification?.sender?.username}
                            </Link>{" "}
                            added new recipe{" "}
                            <Link
                              to={`/recipe/${notification?.recipe?.slug}`}
                              className="text-primary-dark hover:underline hover:cursor-pointer"
                            >
                              {" "}
                              {notification?.recipe?.title}
                            </Link>
                          </p>
                          <p className="text-sm text-gray-500">
                            {notification?.createdAt.split("T")[0]} at{" "}
                            {
                              notification?.createdAt
                                .split("T")[1]
                                .split(".")[0]
                            }
                          </p>
                        </div>
                      </>
                    )}
                    {/* follow  */}
                    {notification?.type === "follow" && (
                      <>
                        <div className="mr-4">
                          <IoPersonAdd className="text-blue-500 text-xl" />
                        </div>
                        <div className="flex-grow">
                          <p className="text-lg font-medium">
                            <Link
                              to={`/view-user/profile?uid=${notification?.sender?._id}`}
                              className="text-primary-dark hover:underline hover:cursor-pointer"
                            >
                              {notification?.sender?.username}
                            </Link>{" "}
                            started following you
                          </p>
                          <p className="text-sm text-gray-500">
                            {notification?.createdAt.split("T")[0]} at{" "}
                            {
                              notification?.createdAt
                                .split("T")[1]
                                .split(".")[0]
                            }
                          </p>
                        </div>
                      </>
                    )}
                    {/* comment  */}
                    {notification?.type === "comment" && (
                      <>
                        <div className="mr-4">
                          <IoChatbubble className="text-green-500 text-xl" />
                        </div>
                        <div className="flex-grow">
                          <p className="text-lg font-medium">
                            <Link
                              to={`/view-user/profile?uid=${notification?.sender?._id}`}
                              className="text-primary-dark hover:underline hover:cursor-pointer"
                            >
                              {notification?.sender?.username}
                            </Link>{" "}
                            {notification?.message}{" "}
                            <Link
                              to={`/recipe/${notification?.recipe?.slug}`}
                              className="text-primary-dark hover:underline hover:cursor-pointer"
                            >
                              {" "}
                              {notification?.recipe?.title}
                            </Link>
                          </p>
                          <p className="text-sm text-gray-500">
                            {notification?.createdAt.split("T")[0]} at{" "}
                            {
                              notification?.createdAt
                                .split("T")[1]
                                .split(".")[0]
                            }
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                {showAll ? (
                  <button
                    className="text-primary font-medium hover:underline"
                    onClick={handleShowNoti}
                  >
                    View Less Notifications
                  </button>
                ) : (
                  <button
                    className="text-primary font-medium hover:underline"
                    onClick={handleShowNoti}
                  >
                    View All Notifications
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-28">
          <h1 className="text-2xl font-semibold text-gray-500">
            Please Login to view notifications
          </h1>
          <img
            src="/images/notification.png"
            alt="notification"
            className="w-96 h-96"
          />
        </div>
      )}
      <Footer />
    </div>
  )
}

export default Notification
