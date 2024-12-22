import React, { useContext, useEffect, useState } from "react"
import Logo from "../components/Logo"
import { Link, redirect, useLocation, useNavigate } from "react-router-dom"
import { FaGoogle } from "react-icons/fa"
import Navbar from "../components/Navbar"
import { IoMdEye } from "react-icons/io"
import { IoMdEyeOff } from "react-icons/io"
import toast from "react-hot-toast"
import { Spinner } from "../components/loader"
import { LoginContext } from "../components/LoginContext"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [seePassword, setSeePassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { setIsLoggedIn, setUserBasicInfo } = useContext(LoginContext)

  const location = useLocation()
  const navigate = useNavigate()

  const searchParams = new URLSearchParams(location.search)
  const redirectPath = searchParams.get("redirect")

  const passwordVisibleHandler = () => {
    setSeePassword((prevSeePassword) => !prevSeePassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (!email || !password) {
        return toast.error("Please fill in all fields")
      }
      setLoading(true)
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
        localStorage.setItem("token", data.token)

        // Set context values
        setIsLoggedIn(true)
        setUserBasicInfo(data.user)

        setTimeout(() => {
          if (redirectPath) {
            navigate(`${redirectPath}`)
          } else {
            navigate("/")
          }
          setLoading(false)
        }, 1000)
      } else {
        toast.error(data.message)
        setLoading(false)
      }

      // Reset form fields if necessary
      setEmail("")
      setPassword("")
    } catch (error) {
      toast.error("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  const authLogin = async () => {
    window.location.href = `http://localhost:8000/auth/google`
  }

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen ">
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Left side */}
          <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
            <Logo />
            <p className="text-2xl font-bold mt-4 text-primary">
              Welcome Back,
            </p>
            <p className="text-lg mt-2 mb-8 text-secondary">
              Please log in to your account
            </p>
            <form className="w-full max-w-sm" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={seePassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  />
                  <p>
                    {seePassword ? (
                      <IoMdEyeOff
                        onClick={passwordVisibleHandler}
                        className="absolute top-3 right-3 cursor-pointer"
                      />
                    ) : (
                      <IoMdEye
                        onClick={passwordVisibleHandler}
                        className="absolute top-3 right-3 cursor-pointer"
                      />
                    )}
                  </p>
                </div>
                <div className="flex justify-end p-1 underline text-primary">
                  <Link to={"/forgot-password"}>Forgot password ?</Link>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex justify-center items-center w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {loading ? (
                  <Spinner
                    width={"10px"}
                    height={"10px"}
                    backgroundColor={"#fff"}
                    padding={"2px"}
                  />
                ) : (
                  <p> Log In</p>
                )}
              </button>
            </form>

            {/* Registration link */}
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to={"/signup"} className="text-primary cursor-pointer">
                  Create an account
                </Link>
              </p>
            </div>

            <div className="my-6 flex items-center">
              <hr className="w-full border-gray-300" />
              <span className="mx-4 text-gray-500">OR</span>
              <hr className="w-full border-gray-300" />
            </div>
            <button
              onClick={authLogin}
              className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100"
            >
              <FaGoogle />
              Continue with Google
            </button>
          </div>

          {/* Right side for image */}
          <div className="hidden md:flex md:w-1/2 relative">
            <img
              src="/images/burger.jpg"
              alt="login"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
