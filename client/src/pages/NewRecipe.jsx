import React, { useContext, useState } from "react"
import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Box,
  OutlinedInput,
  Chip,
  Button,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import PhotoCamera from "@mui/icons-material/PhotoCamera"
import Navbar from "../components/Navbar"
import { Link, useNavigate } from "react-router-dom"
import { LoginContext } from "../components/LoginContext"
import Footer from "../components/Footer"
import { Spinner, DotSpinner } from "../components/loader"

import toast from "react-hot-toast"

const NewRecipe = () => {
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [type, setType] = useState("")
  const [categories, setCategories] = useState([])
  const [ingredients, setIngredients] = useState([""])
  const [methods, setMethods] = useState([""])
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const { userBasicInfo } = useContext(LoginContext)

  // For type
  const handleTypeChange = (event) => {
    setType(event.target.value)
  }

  // For categories
  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  }

  const allCategories = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Dessert",
    "Appetizer",
    "Main Course",
    "Side Dish",
    "Beverage",
    "Salad",
    "Cocktails",
    "Smoothies",
    "Juices",
    "Soft Drinks",
    "Hard Drinks",
    "Hot Drinks",
    "Cold Drinks",
  ]

  function getStyles(name, selectedCategories, theme) {
    return {
      fontWeight:
        selectedCategories.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    }
  }

  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event
    setCategories(typeof value === "string" ? value.split(",") : value)
  }

  // For image upload
  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // For ingredients
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = value
    setIngredients(newIngredients)
  }

  const handleAddIngredient = () => {
    setIngredients([...ingredients, ""])
  }

  // For methods
  const handleMethodChange = (index, value) => {
    const newMethods = [...methods]
    newMethods[index] = value
    setMethods(newMethods)
  }

  const handleAddMethod = () => {
    setMethods([...methods, ""])
  }

  // Handle submit
  const handleSubmit = async (event) => {
    event.preventDefault()
    const recipeData = {
      title,
      summary,
      description,
      image: image ? image.name : "",
      type,
      ingredients,
      methods,
      categories,
    }
    console.log(recipeData)
    const formData = new FormData()
    formData.append("title", title)
    formData.append("summary", summary)
    formData.append("description", description)
    formData.append("image", image)
    formData.append("type", type)
    formData.append("ingredients", JSON.stringify(ingredients))
    formData.append("methods", JSON.stringify(methods))
    formData.append("categories", JSON.stringify(categories))
    formData.append("userId", userBasicInfo._id)

    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/recipe/create-recipe`,
        {
          method: "POST",
          body: formData,
        }
      )
      const data = await response.json()
      if (data.success) {
        toast.success(data.message)
        setLoading(false)
        setTitle("")
        setSummary("")
        setDescription("")
        setImage(null)
        setImagePreview("")
        setType("")
        setCategories([])
        setIngredients([""])
        setMethods([""])

        setTimeout(() => {
          navigate(`/my-account/${userBasicInfo.slug}`)
        }, 500)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Something went wrong", error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <div className="mt-20">
          <div>
            <Link
              to={`/my-account/${userBasicInfo.slug}`}
              className="text-primary hover:underline"
            >
              Back To Profile
            </Link>
          </div>
          <h1 className="flex justify-center items-center  text-primary font-bold text-3xl ">
            Create New Recipe
          </h1>
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              style={{ marginBottom: "20px" }}
            />

            {/* Summary */}
            <TextField
              label="Summary"
              variant="outlined"
              multiline
              rows={2}
              fullWidth
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              margin="normal"
              style={{ marginBottom: "20px" }}
            />

            {/* Description */}
            <TextField
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
              style={{ marginBottom: "20px" }}
            />

            {/* Image Upload */}
            <h2 className="text-2px font-semibold text-primary">
              Upload Image
            </h2>
            <FormControl fullWidth margin="normal">
              {/* <InputLabel htmlFor="image-upload">Upload Image</InputLabel> */}
              <input
                accept="image/*"
                id="image-upload"
                type="file"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<PhotoCamera />}
                  style={{ marginBottom: "10px" }}
                >
                  Upload
                </Button>
              </label>
              {imagePreview && (
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "300px",
                      maxHeight: "300px",
                      borderRadius: "8px",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </Box>
              )}
            </FormControl>

            {/* Type */}
            <h2 className="text-2px font-semibold text-primary">Choose Type</h2>

            <FormControl fullWidth margin="normal">
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                value={type}
                onChange={handleTypeChange}
                label="Type"
                style={{ marginBottom: "20px" }}
              >
                <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                <MenuItem value="Non-Vegetarian">Non-Vegetarian</MenuItem>
                <MenuItem value="drink">Drink</MenuItem>
              </Select>
            </FormControl>

            {/* Categories */}
            <h2 className="text-2px font-semibold text-primary">
              Select Categories
            </h2>

            <FormControl fullWidth margin="normal">
              <InputLabel id="categories-label">Categories</InputLabel>
              <Select
                labelId="categories-label"
                multiple
                value={categories}
                onChange={handleCategoryChange}
                input={
                  <OutlinedInput id="select-multiple-chip" label="Categories" />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
                style={{ marginBottom: "20px" }}
              >
                {allCategories.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, categories, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Ingredients */}
            <h2 className="text-2px font-semibold text-primary">Ingredients</h2>

            <p style={{ marginBottom: "20px" }}>
              Add all the names of ingredients required for this recipe.{" "}
              <span style={{ fontStyle: "italic", color: "#777" }}>
                Note: Add one ingredient per input field
              </span>
            </p>

            <div>
              {ingredients.map((ingredient, index) => (
                <TextField
                  key={index}
                  label={`Ingredient ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  value={ingredient}
                  onChange={(e) =>
                    handleIngredientChange(index, e.target.value)
                  }
                  margin="normal"
                  style={{ marginBottom: "10px" }}
                />
              ))}
              <Button
                variant="outlined"
                onClick={handleAddIngredient}
                sx={{ mt: 2 }}
                style={{
                  color: "#F3043A",
                  borderColor: "#F3043A",
                  marginTop: "10px",
                }}
              >
                Add Ingredient
              </Button>
            </div>

            {/* Methods */}
            <h2 className="text-2px font-semibold text-primary mt-10">
              Add Methods
            </h2>

            <p style={{ marginBottom: "20px" }}>
              Add all the steps to make this recipe.{" "}
              <span style={{ fontStyle: "italic", color: "#777" }}>
                Note: Click Add to add a new step
              </span>
            </p>
            <div>
              {methods.map((method, index) => (
                <TextField
                  key={index}
                  label={`Method ${index + 1}`}
                  variant="outlined"
                  fullWidth
                  value={method}
                  onChange={(e) => handleMethodChange(index, e.target.value)}
                  margin="normal"
                  style={{ marginBottom: "10px" }}
                />
              ))}
              <Button
                variant="outlined"
                onClick={handleAddMethod}
                sx={{ mt: 2 }}
                style={{
                  color: "#F3043A",
                  borderColor: "#F3043A",
                  marginTop: "10px",
                }}
              >
                Add Method
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, backgroundColor: "#F3043A", color: "#FFFFFF" }}
              style={{
                color: "#FFFFFF",
                backgroundColor: "#F3043A",
                "&:hover": {
                  backgroundColor: "#c9032d",
                },
                marginTop: "20px",
                display: "block",
                width: "100%",
              }}
            >
              {loading ? (
                <div className="flex gap-2 justify-center items-center">
                  <p>Creating Your Recipe</p>

                  <Spinner
                    width={"10px"}
                    height={"10px"}
                    backgroundColor={"#fff"}
                    padding={"2px"}
                  />
                </div>
              ) : (
                "Create Recipe"
              )}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default NewRecipe
