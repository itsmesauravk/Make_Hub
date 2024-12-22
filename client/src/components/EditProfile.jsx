import React, { useState, useEffect } from "react"
import { MdClose } from "react-icons/md"
import toast from "react-hot-toast"

import { Spinner } from "./loader"

const EditProfile = ({ isOpen, onClose, userDetails }) => {
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profilePicture, setProfilePicture] = useState(null)
  const [preview, setPreview] = useState(null)
  const [currentProfilePicture, setCurrentProfilePicture] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [privacyError, setPrivacyError] = useState("")
  const [generalLoading, setGeneralLoading] = useState(false)
  const [privacyLoading, setPrivacyLoading] = useState(false)

  useEffect(() => {
    if (userDetails) {
      setUsername(userDetails.username || "")
      setBio(userDetails.bio || "")
      setCurrentProfilePicture(userDetails.profilePicture || "")
    }
  }, [userDetails])

  const handleUpdateGeneral = async (e) => {
    e.preventDefault()

    try {
      setGeneralLoading(true)
      const formData = new FormData()
      formData.append("userId", userDetails._id)
      formData.append("username", username)
      formData.append("bio", bio)
      if (profilePicture) {
        formData.append("image", profilePicture)
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/update-profile`,
        {
          method: "PATCH",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      const data = await response.json()
      if (data.success) {
        onClose()
        window.location.reload()
        setGeneralLoading(false)

        setTimeout(() => {
          toast.success(data.message)
        }, 500)
      } else {
        toast.error(data.message)
        setGeneralLoading(false)
      }
    } catch (error) {
      console.error("Error updating profile: ", error)
      toast.error("Error updating profile")
      setGeneralLoading(false)
    }
  }

  const handleUpdatePrivacy = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      setTimeout(() => {
        setPasswordError("")
      }, 3000)
      return
    }

    const formData = new FormData()
    formData.append("currentPassword", currentPassword)
    formData.append("newPassword", newPassword)

    try {
      setPrivacyLoading(true)
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/update-privacy`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      )
      const data = await response.json()
      if (data.success) {
        onClose()
        window.location.reload()
        setPrivacyLoading(false)
        setTimeout(() => {
          toast.success(data.message)
        }, 500)
      } else {
        setPrivacyError(data.message)
        setPrivacyLoading(false)
      }
    } catch (error) {
      console.error("Error updating profile: ", error)
      setPrivacyError("Error updating profile")
      setPrivacyLoading(false)
    }
  }

  if (privacyError) {
    setTimeout(() => {
      setPrivacyError("")
    }, 4000)
  }

  const handleDeleteAccount = (e) => {
    e.preventDefault()
    // Add logic to handle account deletion when ready
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePicture(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      style={{ zIndex: 9999 }}
    >
      <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 h-10 w-10"
          >
            <MdClose className="w-10 h-10" />
          </button>
        </div>
        <form className="mt-4">
          <div>
            <h3 className="text-lg font-semibold">General</h3>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Enter your new username"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Enter your new bio"
              />
            </div>
            <div className="flex gap-5">
              {currentProfilePicture && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Current Profile Picture
                  </label>
                  <img
                    src={currentProfilePicture}
                    alt="Current Profile"
                    className="mt-2 w-16 h-16 rounded-full object-cover"
                  />
                </div>
              )}
              {preview && (
                <div className="mt-4 ">
                  <label className="block text-sm font-medium text-gray-700">
                    Preview:
                  </label>
                  <img
                    src={preview}
                    alt="Profile Preview"
                    className="mt-2 w-16 h-16 rounded-full object-cover"
                  />
                </div>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-80 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-4 rounded-lg transition-all"
              onClick={handleUpdateGeneral}
            >
              {generalLoading ? (
                <Spinner width="10px" height="10px" backgroundColor="#fff" />
              ) : (
                "Update"
              )}
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Privacy</h3>
            {privacyError && (
              <p className="text-sm text-red-600">{privacyError}</p>
            )}
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Enter current password"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                New Password{" "}
                <span className="text-red-600 italic">{passwordError}</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Enter new password"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password{" "}
                <span className="text-red-600 italic">{passwordError}</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Confirm new password"
              />
            </div>
            <button
              className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 mt-4 rounded-lg transition-all"
              onClick={handleUpdatePrivacy}
            >
              {privacyLoading ? (
                <Spinner width="10px" height="10px" backgroundColor="#fff" />
              ) : (
                "Update"
              )}
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-red-600">Warning</h3>
            <p className="text-sm text-red-600">
              Deleting your account is irreversible. Please proceed with
              caution.
            </p>
            <div className="flex gap-2 items-center">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 mt-4 rounded-lg transition-all"
              >
                Delete Account
              </button>
              <span className="text-sm text-gray-600">
                (Account deletion will be implemented soon.)
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfile
