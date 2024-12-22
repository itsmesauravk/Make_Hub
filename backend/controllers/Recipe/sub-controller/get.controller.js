const Recipe = require('../../../models/recipe.models')
const User = require('../../../models/user.models')


// get all recipes  
const getRecipes = async (req, res) => {
    try {
        
        const recipes = await Recipe.find()
        if (!recipes) {
            return res.status(400).json({ success: false, message: "No recipes found" })
        }
        res.status(200).json({ success: true, recipes })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}


// get recipe for user // dynamic route for my like , my saved and my recipes

// /api/recipe/get-recipe/:userId?type=my-recipes
// /api/recipe/get-recipe/:userId?type=my-likes
// /api/recipe/get-recipe/:userId?type=my-saved

const getRecipeForUser = async (req, res) => {
    try {
        const { type } = req.query
        const userId = req.params.userId


        let user
        if (type === "my-recipes") {
            user = await User.findById(userId).populate('recipesPosted')
        }
        else if (type === "my-likes") {
            user = await User.findById(userId).populate('myLikes')
        }
        else if (type === "my-saved") {
            user = await User.findById(userId).populate('mySaved')
        }
        if (!user) {
            return res.status(400).json({ success: false, message: "No user found" })
        }
        res.status(200).json({ success: true, user })
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}



module.exports = {
    getRecipes,
    getRecipeForUser
} 