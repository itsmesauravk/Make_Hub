import React, { useState, useEffect } from "react"
import {
  TextField,
  Button,
  MenuItem,
  IconButton,
  Container,
  Typography,
} from "@mui/material"
import { IoClose } from "react-icons/io5"
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

const EditRecipePage = () => {
  const { slug } = useParams() // Get slug from params
  const navigate = useNavigate() //  for navigation
  const [loading, setLoading] = useState(true) // Loading state while fetching recipe
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

  // Fetch recipe details from backend by slug
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/recipe/get-one-recipe/${slug}`,
          {
            method: "GET",
          }
        )
        const recipeData = await response.json()

        setNewRecipe({
          title: recipeData.recipe.title,
          summary: recipeData.recipe.summary,
          description: recipeData.recipe.description,
          type: recipeData.recipe.type,
          ingredients: recipeData.recipe.ingredients || [""],
          method: recipeData.recipe.method || [""],
          image: recipeData.recipe.image || "",
          categories: recipeData.recipe.categories || [],
        })
        setLoading(false)
      } catch (error) {
        console.error("Error fetching recipe:", error)
        setLoading(false)
        toast.error("Failed to load recipe details.")
      }
    }

    if (slug) {
      fetchRecipe()
    }
  }, [slug])

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

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/recipe/edit-recipe/${slug}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(newRecipe),
        }
      )
      const data = await response.json()
      if (data.success) {
        toast.success("Recipe updated successfully!")
        navigate(`/recipe/${slug}`) // Redirect after success
      } else {
        toast.error(data.message || "Error updating recipe.")
      }
    } catch (error) {
      console.error("Error updating recipe:", error)
      toast.error("Error updating recipe.")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Edit Recipe
      </Typography>
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
          <Typography variant="h6">Ingredients</Typography>
          {newRecipe.ingredients.map((ingredient, index) => (
            <TextField
              key={index}
              label={`Ingredient ${index + 1}`}
              variant="standard"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              fullWidth
              margin="dense"
            />
          ))}
          <Button
            variant="outlined"
            onClick={handleAddIngredient}
            sx={{ mt: 2 }}
            style={{
              color: "#F3043A",
              borderColor: "#F3043A",
            }}
          >
            Add Ingredient
          </Button>
        </div>
        <div>
          <Typography variant="h6">Method</Typography>
          {newRecipe.method.map((step, index) => (
            <TextField
              key={index}
              label={`Step ${index + 1}`}
              variant="standard"
              value={step}
              onChange={(e) => handleMethodStepChange(index, e.target.value)}
              fullWidth
              margin="dense"
            />
          ))}
          <Button
            variant="outlined"
            onClick={handleAddMethodStep}
            sx={{ mt: 2 }}
            style={{
              color: "#F3043A",
              borderColor: "#F3043A",
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
        <div className="flex justify-between mt-4">
          <Button
            variant="outlined"
            sx={{ color: "#F3043A", borderColor: "#F3043A" }}
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              color: "#FFFFFF",
              backgroundColor: "#F3043A",
              "&:hover": {
                backgroundColor: "#c9032d",
              },
            }}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default EditRecipePage
