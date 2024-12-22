import React from "react"
import "./loader.css"

export const Spinner = ({ width, height, backgroundColor, padding }) => {
  return (
    <div
      class="loader"
      style={{
        width: `${width}`,
        height: `${height}`,
        backgroundColor: `${backgroundColor}`,
        padding: `${padding}`,
      }}
    ></div>
  )
}

export const DotSpinner = ({ width, height, backgroundColor, padding }) => {
  return (
    <div
      class="dot-loader"
      style={{
        width: `${width}`,
        height: `${height}`,
        color: `#fff`,

        padding: `${padding}`,
      }}
    ></div>
  )
}
