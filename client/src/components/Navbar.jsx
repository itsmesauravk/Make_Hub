import React, { useState, useEffect, useContext } from "react"
import Logo from "./Logo"
import { Link } from "react-router-dom"

import { LoginContext } from "./LoginContext"

//for avatar
import Avatar from "@mui/material/Avatar"
import Stack from "@mui/material/Stack"

//bell
import { IoNotifications } from "react-icons/io5"
//find user
import { RiUserSearchFill } from "react-icons/ri"

import Tooltip from "@mui/material/Tooltip"

const Navbar = () => {
  const [bgColor, setBgColor] = useState("transparent")
  const { isLoggedIn, userBasicInfo } = useContext(LoginContext)

  const [countNoti, setCountNoti] = useState(0)

  //getting unread notifications
  const getUnreadNotifications = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/recipe/get-unread-notifications/${userBasicInfo?._id}`
      )
      const data = await response.json()
      if (data.success) {
        setCountNoti(data.data)
      }
    } catch (error) {
      console.log("Error while fetching notifications", error)
    }
  }

  useEffect(() => {
    if (userBasicInfo?._id) {
      getUnreadNotifications()
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setBgColor(window.scrollY > 20 ? "#FBFBFB" : "transparent")
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
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

  return (
    <nav
      className="navbar fixed top-0 left-0 w-full z-10 flex justify-between items-center px-4 py-2 md:px-16 md:py-4 bg-opacity-90"
      style={{
        backgroundColor: bgColor,
        transition: "background-color 0.3s ease",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Logo */}
      <Logo />

      {/* Links for larger screens */}
      <div className="hidden md:flex space-x-6 text-secondary">
        <Link
          to="/"
          className="font-semibold hover:text-primary transition-colors"
        >
          Home
        </Link>
        <Link
          to="/all-recipes?page=1"
          className="font-semibold hover:text-primary transition-colors"
        >
          All Recipes
        </Link>
        <Link
          to="/about"
          className="font-semibold hover:text-primary transition-colors"
        >
          About Us
        </Link>

        <Link
          to="/search"
          className="font-semibold hover:text-primary transition-colors"
        >
          Search
        </Link>
      </div>

      {/* Right Section with Avatar, Notifications, and Find User */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <Tooltip title="Notifications" arrow>
          <Link
            className="flex gap-1 p-1 rounded-md hover:text-primary-dark"
            to={"/notifications"}
          >
            <span className="text-secondary">
              {countNoti && countNoti > 0 ? (
                <span className="font-semibold text-primary-dark ">
                  ({countNoti || 0})
                </span>
              ) : (
                ""
              )}
            </span>{" "}
            <IoNotifications className="text-2xl animate-wiggle" />
          </Link>
        </Tooltip>

        {/* Find User */}
        <Tooltip title="Find Users" arrow>
          <Link
            className="flex gap-1 p-1 rounded-md hover:text-primary-dark"
            to={"/find-users"}
          >
            <RiUserSearchFill className="text-2xl" />
          </Link>
        </Tooltip>

        {isLoggedIn ? (
          <Tooltip title="My Account" arrow>
            <Link
              to={`/my-account/${userBasicInfo?.slug}`}
              className="flex items-center gap-1 translate-x-1"
            >
              {userBasicInfo?.profilePicture ? (
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
              <p className="text-primary font-semibold">
                {userBasicInfo?.username}
              </p>
            </Link>
          </Tooltip>
        ) : (
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline hover:text-primary-dark transition duration-300 ease-in-out"
          >
            Log In
          </Link>
        )}
      </div>

      {/* Hamburger Menu for smaller screens */}
      <div className="md:hidden">
        <button
          className="text-secondary focus:outline-none"
          onClick={() => {
            // toggle mobile menu
          }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
