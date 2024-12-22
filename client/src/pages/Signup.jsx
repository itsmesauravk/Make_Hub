import React, { useState } from "react"
import Logo from "../components/Logo"
import { Link, useNavigate } from "react-router-dom"
import { FaGoogle } from "react-icons/fa"
import Navbar from "../components/Navbar"
import { IoMdEye, IoMdEyeOff } from "react-icons/io"
import toast from "react-hot-toast"
import { Spinner } from "../components/loader"

const Signup = () => {
  const [seePassword, setSeePassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    bio: "",
  })

  const passwordVisibleHandler = () => {
    setSeePassword((prevState) => !prevState)
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (
      formData.username === "" ||
      formData.fullname === " " ||
      formData.email === "" ||
      formData.password === "" ||
      formData.bio === ""
    ) {
      toast.error("Please fill all the fields")
      return
    }

    if (formData.bio.length > 200) {
      toast.error("Bio should be less than 200 characters")
      return
    }
    if (formData.password.length < 6) {
      toast.error("Password should be at least 6 characters")
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
        setLoading(false)
        setFormData({
          username: "",
          fullname: "",
          email: "",
          password: "",
          bio: "",
        })
        navigate("/login")
      } else {
        toast.error(data.message)
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong, please try again")
      setLoading(false)
    }
  }

  return (
    <div className="">
      <Navbar />
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Left side */}
          <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
            <Logo />
            <p className="text-2xl font-bold mt-4 text-primary">Join Us,</p>
            <p className="text-lg mt-2 mb-8 text-secondary">
              Create your account to get started
            </p>
            <form className="w-full max-w-sm" onSubmit={handleSubmit}>
              {/* username  */}
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="username must be unique"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              {/* fullname  */}
              <div className="mb-4">
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  placeholder="Enter your full name (cannot be changed later)"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              {/* email  */}
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
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              {/* password  */}
              <div className="mb-4">
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
                    value={formData.password}
                    onChange={handleChange}
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
              </div>
              {/* bio */}
              <div className="mb-4">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  placeholder="Tell us about yourself (max 200 characters)"
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                ></textarea>
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
                  "Sign Up"
                )}
              </button>
            </form>

            {/* Login link */}
            <div className="mt-6">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link to={"/login"} className="text-primary cursor-pointer">
                  Log In
                </Link>
              </p>
            </div>

            <div className="my-6 flex items-center">
              <hr className="w-full border-gray-300" />
              <span className="mx-4 text-gray-500">OR</span>
              <hr className="w-full border-gray-300" />
            </div>
            <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100">
              <FaGoogle />
              Continue with Google
            </button>
          </div>

          {/* Right side for image */}
          <div className="hidden md:flex md:w-1/2 relative">
            <img
              src="/images/burger.jpg"
              alt="signup"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
