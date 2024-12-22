const User = require('../../../models/user.models');
const Notification = require('../../../models/notification.model');




// Follow a user if not followed already and unfollow if followed

const followController = async (req, res) => {
    try {  
        const {userId, followId} = req.body;     // userId is the user who is following and followId is the user who is being followed
        const user = await User.findById(userId);  //me
        const followUser = await User.findById(followId); // other user

        if(!user || !followUser) return res.status(400).json({msg: "Unable to follow user"});

        // Check if the user is already following the followId
        const isFollowing = user.following.includes(followId);
        if(isFollowing) {
            // Unfollow the user
            const updatedUser = await User.findByIdAndUpdate(userId, {$pull: {following: followId}}, {new: true});
            const updatedFollowUser = await User.findByIdAndUpdate(followId, {$pull: {followers: userId}}, {new: true});
            return res.status(200).json({success:true, message:"Unfollowed"});
        }else{
            // Follow the user
            const updatedUser = await User.findByIdAndUpdate(userId, {$push: {following: followId}}, {new: true});
            const updatedFollowUser = await User.findByIdAndUpdate(followId, {$push: {followers: userId}}, {new: true});

            const notification = new Notification({
                type: 'follow',
                sender: userId,
                receiver: followId,
                message: `${updatedUser.username} started following you`,
            });
            
            await notification.save();


            return res.status(200).json({success:true, message:"Following"});
        }
        
    } catch (error) {
        return res.status(500).json({success:false, message:"Internal server error"});
    }
}


module.exports = followController;