const Recipe = require('../../../models/recipe.models');
const User = require('../../../models/user.models');

const getRecipeFromSlug = async (req, res) => {
    try {
        const slug = req.params.slug;

        // Fetch the recipe by slug with related user and rating information
        const recipe = await Recipe.findOne({ slug })
            .populate({
                path: 'userId',
                select: 'username email profilePicture'
            })
            ?.populate({
                path: 'ratings',
                select: 'rating comment',
                populate: {
                    path: 'userId',
                    select: 'username profilePicture'
                }
            });

        if (!recipe) {
            return res.status(404).json({ success: false, message: "Recipe Not Found" });
        }

        // Update views count and save the recipe
        recipe.views += 1;
        await recipe.save();

        return res.status(200).json({ success: true, message: "Recipe Found Successfully", recipe });

    } catch (error) {
        console.error("Error in getRecipeFromSlug:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = getRecipeFromSlug;
