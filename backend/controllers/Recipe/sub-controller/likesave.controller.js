const Recipe = require("../../../models/recipe.models");
const User = require("../../../models/user.models");
const Rating = require("../../../models/reciperating.models");
const Notification = require("../../../models/notification.model")




//add like to recipe and user profile

const likeRecipe = async (req, res) => {
    try {
        const {userId, recipeId} = req.body;

        if(!userId || !recipeId){
            return res.status(400).json({success: false, message: 'Unable to like recipe'});
        }

        //check for user and recipe
        const user = await User.findById(userId);
        const recipe = await Recipe.findById(recipeId);

        if(!user || !recipe){
            return res.status(400).json({success: false, message: 'Unable to like recipe'});
        }

        // add like if not already liked and remove like if already liked

        if(recipe.likes.includes(userId)){
            //remove like
            const updateRecipe = await Recipe.findByIdAndUpdate(recipeId, {
                $pull: {likes: userId}
            }, {new: true});

            updateRecipe.likeCounts -= 1

            await updateRecipe.save()

            if(!updateRecipe){
                return res.status(400).json({success: false, message: 'Unable to like recipe'});
            }

            //remove like from user profile
            const updateUser = await User.findByIdAndUpdate(userId, {
                $pull: {myLikes: recipeId}
            }, {new: true});

            if(!updateUser){
                return res.status(400).json({success: false, message: 'Unable to like recipe'});
            }

            res.status(200).json({success: true, message: 'Removed From Likes'});
        }else{
            //add like
            const updateRecipe = await Recipe.findByIdAndUpdate(recipeId, {
                $push: {likes: userId}
            }, {new: true});

            updateRecipe.likeCounts += 1

            await updateRecipe.save()


            if(!updateRecipe){
                return res.status(400).json({success: false, message: 'Unable to like recipe'});
            }

            //add like to user profile
            const updateUser = await User.findByIdAndUpdate(userId, {
                $push: {myLikes: recipeId}
            }, {new: true});

            if(!updateUser){
                return res.status(400).json({success: false, message: 'Unable to like recipe'});
            }

                  // Create notification
            const notification = new Notification({
                type: 'like',
                sender: userId,
                receiver: recipe.userId,
                recipe: recipeId,
                message: `${updateUser.username} liked your recipe ${recipe.title}`,
            });
            
            await notification.save();


            res.status(200).json({success: true, message: 'Added To Likes'});
        }

        // sendLikeNotification(userId, recipeId);

        
    } catch (error) {
        console.error('Error adding like:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
        
    }
}


//save recipe
const saveRecipe = async (req, res) => {
    try {
        const {userId, recipeId} = req.body;

        if(!userId || !recipeId){
            return res.status(400).json({success: false, message: 'Unable to save recipe'});
        }

        //check for user and recipe
        const user = await User.findById(userId);
        const recipe = await Recipe.findById(recipeId);

        if(!user || !recipe){
            return res.status(400).json({success: false, message: 'Unable to save recipe'});
        }

        // add like if not already liked and remove like if already liked

        if(recipe.saved.includes(userId)){
            //remove like
            const updateRecipe = await Recipe.findByIdAndUpdate(recipeId, {
                $pull: {saved: userId}
            }, {new: true});

            if(!updateRecipe){
                return res.status(400).json({success: false, message: 'Unable to save recipe'});
            }

            //remove like from user profile
            const updateUser = await User.findByIdAndUpdate(userId, {
                $pull: {mySaved: recipeId}
            }, {new: true});

            if(!updateUser){
                return res.status(400).json({success: false, message: 'Unable to save recipe'});
            }

            res.status(200).json({success: true, message: 'Removed From Saved'});
        }else{
            //add like
            const updateRecipe = await Recipe.findByIdAndUpdate(recipeId, {
                $push: {saved: userId}
            }, {new: true});

            if(!updateRecipe){
                return res.status(400).json({success: false, message: 'Unable to save recipe'});
            }

            //add like to user profile
            const updateUser = await User.findByIdAndUpdate(userId, {
                $push: {mySaved: recipeId}
            }, {new: true});

            if(!updateUser){
                return res.status(400).json({success: false, message: 'Unable to save recipe'});
            }

            res.status(200).json({success: true, message: 'Added To Saved'});
        }

        
    } catch (error) {
        console.error('Error adding save:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
        
    }
}


module.exports = {
    likeRecipe,
    saveRecipe
}