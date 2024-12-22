const Recipe = require('../../../models/recipe.models');


//edit recipe 

const editRecipe = async (req, res) => {
    try {
        const slug = req.params.slug;
        const { title, description, ingredients, method, categories, image } = req.body;

        // Fetch the recipe by slug
        const recipe = await Recipe.findOne({ slug });

        if (!recipe) {
            return res.status(404).json({ success: false, message: "Recipe Not Found" });
        }

        // Update the recipe
        recipe.title = title;
        recipe.description = description;
        recipe.ingredients = ingredients;
        recipe.method = method;
        recipe.categories = categories;
        recipe.image = image;

        await recipe.save();

        return res.status(200).json({ success: true, message: "Recipe Updated Successfully", recipe });

    } catch (error) {
        console.error("Error in editRecipe:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });

    }

}

module.exports = editRecipe;