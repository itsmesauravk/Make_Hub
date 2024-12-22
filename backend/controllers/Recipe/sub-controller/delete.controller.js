const User = require('../../../models/user.models');
const Recipe = require('../../../models/recipe.models');
const Notification = require('../../../models/notification.model');

const deleteRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const userId = req.user._id;  // From authentication middleware

     

        // Ensure the recipe ID is provided
        if (!recipeId) {
            return res.status(400).json({ success: false, message: 'Recipe id is required' });
        }

        // Find the recipe
        const recipe = await Recipe.findById(recipeId);

        // Check if the recipe exists
        if (!recipe) {
            return res.status(404).json({ success: false, message: 'Recipe not found' });
        }

        // Verify the recipe belongs to the authenticated user
        if (recipe.userId.toString() === userId.toString()) {
            // Remove the recipe using findByIdAndDelete
            await Recipe.findByIdAndDelete(recipeId);

            // Delete related notifications
            await Notification.deleteMany({ recipe: recipeId });  

            // Send success response
            return res.status(200).json({ success: true, message: 'Recipe deleted successfully' });
        } else {
            return res.status(403).json({ success: false, message: 'Unauthorized Request' });
        }
    } catch (error) {
        console.error('Error deleting recipe:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

module.exports = deleteRecipe;
