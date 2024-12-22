const Recipe = require("../../../models/recipe.models");
const User = require("../../../models/user.models");
const Rating = require("../../../models/reciperating.models");
const Notification = require("../../../models/notification.model")



// create a rating 
const createRating = async (req, res) => {
    try {
        const {userId, recipeId, rating, comment} = req.body;


        if(!userId || !recipeId || !rating){
            return res.status(400).json({success: false, message: 'Please fill all fields'});
        }

        //check for user and recipe
        const user = await User.findById(userId);
        const recipe = await Recipe.findById(recipeId);
        if(!user || !recipe){
            return res.status(400).json({success: false, message: 'User or Recipe not found'});
        }

        const createRating = new Rating({
            userId,
            recipeId,
            rating,
            comment
        });

        userRating = await createRating.save();

        if(!userRating){
            return res.status(400).json({success: false, message: 'Rating not created'});
        }

        //update recipe rating
        const updateRecipeRating = await Recipe.findByIdAndUpdate(recipeId, {
            $push: {ratings: userRating._id}
        }, {new: true});

        if(!updateRecipeRating){
            return res.status(400).json({success: false, message: 'Rating not updated'});
        }

              // Create notification
              const notification = new Notification({
                type: 'comment',
                sender: userId,
                receiver: updateRecipeRating.userId,
                recipe: recipeId,
                message: `commented "${comment}" on your recipe `,
            });
            
            await notification.save();

        res.status(200).json({success: true, message: 'Rating created successfully', data: userRating});

        
    } catch (error) {
        console.error('Error creating rating:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
        
    }
}




module.exports = {
    createRating
}