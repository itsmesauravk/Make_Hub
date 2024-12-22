const User = require('../../../models/user.models');
const Recipe = require('../../../models/recipe.models');


const inspectUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).select('-password').populate('recipesPosted');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        res.status(200).json({ success: true,message:"User Found Successfull", user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }

}


module.exports = inspectUser;