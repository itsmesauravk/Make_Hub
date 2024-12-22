import React from "react"
import { Link } from "react-router-dom"
import { SiCodechef } from "react-icons/si"

const Logo = () => {
  return (
    <Link
      to="/"
      className="text-primary text-2xl font-bold"
      style={{ fontFamily: "Kaushan Script, cursive" }}
    >
      <SiCodechef className="inline-block mr-1" />
      makeHub
    </Link>
  )
}

export default Logo
