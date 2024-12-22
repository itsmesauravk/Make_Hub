import React, { useState } from "react"
import {
  TextField,
  Button,
  MenuItem,
  DialogActions,
  DialogContent,
  IconButton,
} from "@mui/material"
import { IoClose } from "react-icons/io5"

const AddRecipePage = ({ isOpen, onClose }) => {
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    summary: "",
    description: "",
    type: "",
    ingredients: [""],
    method: [""],
    image: "",
    categories: [],
  })

  const types = [
    { value: "Vegetarian", label: "Vegetarian" },
    { value: "Non-Vegetarian", label: "Non-Vegetarian" },
  ]

  const categories = ["Lunch", "Dinner", "Meal", "Breakfast"]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewRecipe((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...newRecipe.ingredients]
    newIngredients[index] = value
    setNewRecipe((prev) => ({
      ...prev,
      ingredients: newIngredients,
    }))
  }

  const handleAddIngredient = () => {
    setNewRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }))
  }

  const handleMethodStepChange = (index, value) => {
    const newMethod = [...newRecipe.method]
    newMethod[index] = value
    setNewRecipe((prev) => ({
      ...prev,
      method: newMethod,
    }))
  }

  const handleAddMethodStep = () => {
    setNewRecipe((prev) => ({
      ...prev,
      method: [...prev.method, ""],
    }))
  }

  const handleCategoryChange = (e) => {
    const { value } = e.target
    setNewRecipe((prev) => ({
      ...prev,
      categories: value,
    }))
  }

  const handleSubmit = () => {
    console.log(JSON.stringify(newRecipe, null, 2))
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4"
      style={{ zIndex: 9999 }}
    >
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-semibold text-center mb-4">Add Recipe</h2>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <IoClose />
        </IconButton>
        <DialogContent dividers>
          <form className="flex flex-col gap-4">
            <TextField
              label="Title"
              variant="standard"
              name="title"
              value={newRecipe.title}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Summary"
              variant="standard"
              name="summary"
              value={newRecipe.summary}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Description"
              variant="standard"
              name="description"
              multiline
              rows={4}
              value={newRecipe.description}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              select
              label="Type"
              name="type"
              value={newRecipe.type}
              onChange={handleInputChange}
              helperText="Please select food type"
              variant="standard"
              fullWidth
            >
              {types.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <div>
              <h4 className="text-md font-medium">Ingredients</h4>
              {newRecipe.ingredients.map((ingredient, index) => (
                <TextField
                  key={index}
                  label={`Ingredient ${index + 1}`}
                  variant="standard"
                  value={ingredient}
                  onChange={(e) =>
                    handleIngredientChange(index, e.target.value)
                  }
                  fullWidth
                  margin="dense"
                />
              ))}
              <Button
                variant="outlined"
                onClick={handleAddIngredient}
                sx={{ mt: 2 }}
                style={{
                  color: "#F3043A", // Primary color
                  borderColor: "#F3043A", // Primary color
                }}
              >
                Add Ingredient
              </Button>
            </div>
            <div>
              <h4 className="text-md font-medium">Method</h4>
              {newRecipe.method.map((step, index) => (
                <TextField
                  key={index}
                  label={`Step ${index + 1}`}
                  variant="standard"
                  value={step}
                  onChange={(e) =>
                    handleMethodStepChange(index, e.target.value)
                  }
                  fullWidth
                  margin="dense"
                />
              ))}
              <Button
                variant="outlined"
                onClick={handleAddMethodStep}
                sx={{ mt: 2 }}
                style={{
                  color: "#F3043A", // Primary color
                  borderColor: "#F3043A", // Primary color
                }}
              >
                Add Step
              </Button>
            </div>
            <TextField
              label="Image URL"
              variant="standard"
              name="image"
              value={newRecipe.image}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              select
              label="Categories"
              name="categories"
              value={newRecipe.categories}
              onChange={handleCategoryChange}
              helperText="Please select categories"
              variant="standard"
              fullWidth
              SelectProps={{
                multiple: true,
              }}
            >
              {categories.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </form>
        </DialogContent>
        <DialogActions className="flex justify-between">
          <Button
            sx={{ color: "#F3043A" }} // Primary color
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            sx={{
              color: "#FFFFFF",
              backgroundColor: "#F3043A", // Primary color
              "&:hover": {
                backgroundColor: "#c9032d", // Darker shade of primary color
              },
            }}
          >
            Create
          </Button>
        </DialogActions>
      </div>
    </div>
  )
}

export default AddRecipePage
