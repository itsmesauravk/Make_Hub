import React, { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Spinner } from "../components/loader"
import FetchErrorPage from "../components/FetchErrorPage"
import toast from "react-hot-toast"

const EmailVerification = () => {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(false)
  const [startCountdown, setStartCountdown] = useState(false)
  const [count, setCount] = useState(120)
  const [resendLoading, setResendLoading] = useState(false)

  const navigate = useNavigate()

  const location = useLocation()

  const verifyToken = new URLSearchParams(location.search).get("verify-token")

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/verify-reset-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp,
            verifyToken,
          }),
        }
      )
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
        navigate(`/reset-password?reset-token=${data.resetToken}`)
        setLoading(false)
        setFetchError(false)
      } else {
        toast.error(data.message)
        setLoading(false)
        setFetchError(false)
      }
    } catch (error) {
      toast.error("Something went wrong, Try again", error)
      setFetchError(true)
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      setResendLoading(true)
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verifyToken,
          }),
        }
      )
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
        setStartCountdown(true)
        startCountdownTimer()
        setResendLoading(false)
      } else {
        toast.error(data.message)
        setResendLoading(false)
      }
    } catch (error) {
      toast.error("Something went wrong, Try again", error)
      setFetchError(true)
      setResendLoading(false)
    }
  }

  // start 2 min countdown
  const startCountdownTimer = () => {
    let seconds = 120
    const countdown = setInterval(() => {
      seconds--
      setCount(seconds)
      if (seconds <= 0) {
        clearInterval(countdown)
        setCount(120)
        setStartCountdown(false)
      }
    }, 1000)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Fetch Error */}
      {fetchError && <FetchErrorPage error={fetchError} />}

      {/* Title */}
      <h1 className="text-3xl font-bold text-primary mb-6">
        Verify Your Email
      </h1>

      {/* Image */}
      <div className="mb-6">
        <img
          src="https://cdn-icons-png.flaticon.com/512/6195/6195696.png"
          alt="OTP verification"
          className="w-32 h-32"
        />
      </div>

      {/* Instruction Text */}
      <p className="text-center text-gray-600 mb-4">
        Please enter the 6-digit code sent to <br />
        <span className="font-semibold text-gray-800">your provied gmail</span>
      </p>
      <p className="text-gray-500 italic text-sm mb-2">
        Code Expires in 10 minutes
      </p>

      {/* OTP Input */}
      <div className="mb-6 w-full max-w-sm">
        <input
          type="number"
          placeholder="Enter 6-Digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-center text-lg"
        />
      </div>

      {/* Resend Code Button */}
      <div className="flex flex-col justify-center items-center gap-2 mb-6">
        {startCountdown ? (
          <p className="text-gray-600">
            Resend code again in{" "}
            <span className="text-primary-dark font-semibold">{count} </span>
            second
          </p>
        ) : (
          <div className="flex gap-2">
            <p className="text-gray-600">Didn't receive the code?</p>
            {resendLoading ? (
              <Spinner
                width={"20px"}
                height={"20px"}
                padding={"2px"}
                backgroundColor={"#F3043A"}
              />
            ) : (
              <button
                onClick={handleResendCode}
                disables={startCountdown}
                className="text-primary underline hover:cursor-pointer"
              >
                Resend Code
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        <Link to="/forgot-password" className="text-primary hover:underline">
          Change Email
        </Link>
      </div>

      {/* Verify Button */}
      <button
        className="w-full max-w-sm bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300"
        disabled={loading}
        onClick={handleVerifyOtp}
      >
        {loading ? (
          <div className="flex gap-2 justify-center items-center">
            Please Wait{" "}
            <Spinner width={"20px"} height={"20px"} padding={"2px"} />
          </div>
        ) : (
          "Verify"
        )}
      </button>
    </div>
  )
}

export default EmailVerification
