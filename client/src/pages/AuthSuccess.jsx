import React, { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LoginContext } from "../components/LoginContext"

const AuthSuccess = () => {
  const navigate = useNavigate()
  const { isLoggedIn, setIsLoggedIn, setUserBasicInfo } =
    useContext(LoginContext)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")

    console.log("Token:", token)

    if (token) {
      // Store the token in localStorage or cookies

      localStorage.setItem("token", token)

      // Redirect to the home page or dashboard
      navigate("/")
    } else {
      // If there's no token, redirect to the login page
      navigate("/login")
    }
  }, [])

  return <div>Loading...</div>
}

export default AuthSuccess
