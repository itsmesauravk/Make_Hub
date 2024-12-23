import { createContext, useState } from "react"

export const RecipeContext = createContext()

const RecipeProvider = ({ children }) => {
  const [totalRecipes, setTotalRecipes] = useState(0)

  return (
    <RecipeContext.Provider value={{ totalRecipes, setTotalRecipes }}>
      {children}
    </RecipeContext.Provider>
  )
}

export { RecipeProvider }
