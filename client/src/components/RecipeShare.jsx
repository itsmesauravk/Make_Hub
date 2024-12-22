import React from "react"
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
} from "react-share"
import { FacebookIcon, TwitterIcon, WhatsappIcon, EmailIcon } from "react-share"

const RecipeShare = ({ recipeUrl, recipeTitle }) => {
  return (
    <div className="flex space-x-2">
      <FacebookShareButton url={recipeUrl} quote={recipeTitle}>
        <FacebookIcon size={32} round={true} />
      </FacebookShareButton>

      <TwitterShareButton url={recipeUrl} title={recipeTitle}>
        <TwitterIcon size={32} round={true} />
      </TwitterShareButton>

      <WhatsappShareButton url={recipeUrl} title={recipeTitle}>
        <WhatsappIcon size={32} round={true} />
      </WhatsappShareButton>

      <EmailShareButton url={recipeUrl} subject={recipeTitle}>
        <EmailIcon size={32} round={true} />
      </EmailShareButton>
    </div>
  )
}

export default RecipeShare
