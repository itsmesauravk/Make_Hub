import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import FetchErrorPage from "../components/FetchErrorPage"
import { Spinner } from "../components/loader"
import toast from "react-hot-toast"

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [email, setEmail] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      )
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
        navigate(`/email-verification?verify-token=${data.verifyToken}`)
        setLoading(false)
        setFetchError(false)
        setEmail("")
      } else {
        toast.error(data.message)
        setLoading(false)
      }
      setLoading(false)
    } catch (error) {
      setFetchError(true)
      setLoading(false)
    }
  }

  return (
    <>
      {/* Fetch Error */}
      {fetchError && <FetchErrorPage />}
      {!fetchError && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          {/* Title */}
          <h1 className="text-3xl font-bold text-primary mb-8">
            Forgot Password
          </h1>

          {/* Image */}
          <div className="mb-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/6146/6146586.png"
              alt="Forgot password"
              className="w-32 h-32"
            />
          </div>

          {/* Text */}
          <p className="text-center text-gray-600 mb-6">
            Please enter your email address to receive a <br />
            verification code in your email.
          </p>

          {/* Input Field */}
          <div className="mb-6 w-full max-w-sm">
            <label className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Back to Login */}
          <div className="mb-6">
            <Link
              to="/login"
              className="text-primary underline hover:cursor-pointer"
            >
              Back to Login
            </Link>
          </div>

          {/* Send OTP */}
          <button
            onClick={handleSubmit}
            className="w-full max-w-sm bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300"
            disabled={loading}
          >
            {loading ? (
              <div className="flex gap-2 justify-center items-center">
                Sending
                <Spinner width={"20px"} height={"20px"} padding={"3px"} />
              </div>
            ) : (
              "Send OTP"
            )}
          </button>
        </div>
      )}
    </>
  )
}

export default ForgotPassword
