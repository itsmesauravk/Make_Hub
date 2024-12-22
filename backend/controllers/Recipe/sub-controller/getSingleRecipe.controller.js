// Initilize packages
const Recipe = require('../../../models/recipe.models');


// get single recipe
const getOneRecipe = async (req, res) => {
    try {
        const slug = req.params.slug;

        // Fetch the recipe by slug with related user and rating information
        const recipe = await Recipe.findOne({ slug })

        if (!recipe) {
            return res.status(404).json({ success: false, message: "Recipe Not Found" });
        }

        return res.status(200).json({ success: true, message: "Recipe Found Successfully", recipe });
        
    } catch (error) {
        console.error("Error in getOneRecipe:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
        
    }
}


module.exports = getOneRecipe;

