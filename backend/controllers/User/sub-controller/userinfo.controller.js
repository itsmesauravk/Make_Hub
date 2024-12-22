const User = require('../../../models/user.models');

const jwt = require('jsonwebtoken');

const userInfo = async (req, res) => {
    try {
        // Check for Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const token = authHeader.split(' ')[1]; // Extract token from Authorization header

        // Verify token and extract user ID
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // Fetch user information from database
        const user = await User.findById(userId).select('username email profilePicture slug');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Send response with user information
        res.status(200).json({ success: true, message: "User found successfully", user });


    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const userProfile = async(req,res)=>{
    try {
        const {slug} = req.params

        if(!slug){
            return res.status(400).json({success:false, message:"User Not found"})
        }

        
        // Fetch user information from database
        const user = await User.findOne({slug}).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Send response with user information
        res.status(200).json({ success: true, message: "User found successfully", user });


    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = {userInfo, userProfile};
