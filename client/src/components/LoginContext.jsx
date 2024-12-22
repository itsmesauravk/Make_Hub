import { createContext, useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export const LoginContext = createContext()

const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userBasicInfo, setUserBasicInfo] = useState({})

  setTimeout(() => {
    if (isLoggedIn && window.location.pathname === "/login") {
      window.location.href = "/"
    } else if (isLoggedIn && window.location.pathname === "/signup") {
      window.location.href = "/"
    }
  }, 1000)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setIsLoggedIn(false)

          return
        }
        // Fetch user info from server
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/user-info`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const data = await response.json()
        if (data.success) {
          setUserBasicInfo(data.user)
          setIsLoggedIn(true)
        } else {
          setIsLoggedIn(false)
        }
      } catch (error) {
        console.error("Error fetching user info", error)
        // Handle error (e.g., log out user, notify them, etc.)
      }
    }

    const checkLoggedIn = () => {
      const token = localStorage.getItem("token")
      if (token) {
        setIsLoggedIn(true)
        fetchUserInfo()
      }
    }

    checkLoggedIn()
  }, [])

  return (
    <LoginContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, userBasicInfo, setUserBasicInfo }}
    >
      {children}
    </LoginContext.Provider>
  )
}

export default LoginProvider
