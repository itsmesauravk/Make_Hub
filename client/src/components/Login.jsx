import React, { useContext } from "react"
import Logo from "./Logo"
import { Link } from "react-router-dom"

import { LoginContext } from "./LoginContext"

const Login = () => {
  const { handleLoginClose } = useContext(LoginContext)
  return (
    <div className="absolute z-9999 top-20 left-96 flex h-[80vh] ">
      {/* Left side */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gray-100 p-8">
        <Logo />
        <p className="text-2xl font-bold mt-4 text-primary">Welcome Back,</p>
        <p className="text-lg mt-2 mb-8 text-secondary">
          Please log in to your account
        </p>
        <form className="w-full max-w-sm">
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
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Log In
          </button>
        </form>

        {/* for registration */}
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to={"/register"} className="text-primary cursor-pointer">
              Register
            </Link>
          </p>
        </div>

        <div className="my-6 flex items-center">
          <hr className="w-full border-gray-300" />
          <span className="mx-4 text-gray-500">OR</span>
          <hr className="w-full border-gray-300" />
        </div>
        <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M23 12.29c0-.82-.07-1.61-.19-2.39H12v4.65h5.89c-2.76 2.58-6.22 4.26-10.21 4.26-6.42 0-11.64-5.21-11.64-11.64S1.58.36 8 .36c4.55 0 8.54 2.54 10.14 6.2l5.11-5.11C22.37 1.48 17.41 0 12 0 5.38 0 0 5.38 0 12s5.38 12 12 12c6.3 0 11.58-5.02 11.99-11.71z" />
          </svg>
          Continue with Google
        </button>
      </div>

      {/* Right side for image */}
      <div className="hidden md:flex md:w-1/2 relative">
        <img
          src="/images/loginimg.jpg"
          alt="login"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Close button */}
      <button
        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
        onClick={handleLoginClose}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  )
}

// export default Login
