import React from "react"
import { Navigate } from "react-router-dom"
import { useContext } from "react"
import { LoginContext } from "./components/LoginContext"

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { isLoggedIn } = useContext(LoginContext)

  return isLoggedIn ? <Element {...rest} /> : <Navigate to="/login" />
}

export default PrivateRoute
