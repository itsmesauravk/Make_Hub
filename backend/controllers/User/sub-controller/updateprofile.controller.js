const User = require('../../../models/user.models');

const {uploadFile, deleteFile} = require('../../../Utils/fileUpload')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// update general info
const updateProfile = async (req, res) => {
    try {
        const {username, bio} = req.body;
        console.log(username, bio)

        const token = req.headers.authorization.split(" ")[1];

        //validate user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) return res.status(400).json({success:false, message:"Unauthorized"});

        const userId = decoded.id;


        

        const image = req?.file?.path;
       


        const user = await User.findById(userId);
        

        if(!user) return res.status(400).json({success:false, message:"Unauthorized"});

        const updatedUser = await User.findByIdAndUpdate(userId, {
            username,
            bio
        }, {new: true});


        if(!updatedUser) return res.status(400).json({success:false, message:"Unable to update profile"});

        if(image) {
            const oldProfilePicture = user.profilePicture;
            const newProfilePicture = await uploadFile(image);
            
            updatedUser.profilePicture = newProfilePicture.secure_url;
            updatedUser.imageId = newProfilePicture.public_id;

            if(oldProfilePicture !== "") {
                await deleteFile(user.imageId);
            }
        }

        await updatedUser.save();

        return res.status(200).json({success:true, message:"Profile updated successfully"});


    }
    catch (error) {
        return res.status(500).json({success:false, message:"Internal server error"});
    }
}


// update privacy info

const updatePrivacy = async (req, res) => {
    try {

        const {currentPassword, newPassword} = req.body;
        
        const token = req.headers.authorization.split(" ")[1];
        console.log(token)


        if(!currentPassword || !newPassword) return res.status(400).json({success:false, message:"Please provide old password and new password"});

        if(!token) return res.status(400).json({success:false, message:"Unauthorized"});

        //validate user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) return res.status(400).json({success:false, message:"Unauthorized"});

        const userId = decoded.id;

        //validate password
        const user = await User.findById(userId);
        if(!user) return res.status(400).json({success:false, message:"Unauthorized"});

        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if(!validPassword) return res.status(400).json({success:false, message:"Invalid Current Password"});


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const updatedUser = await User.findByIdAndUpdate(userId, {
            password: hashedPassword
        }, {new: true});

        if(!updatedUser) return res.status(400).json({success:false, message:"Unable to update password"});

        return res.status(200).json({success:true, message:"Password updated successfully"});
        
    } catch (error) {
        return res.status(500).json({success:false, message:"Internal server error"});
        
    }
}


module.exports = {updateProfile, updatePrivacy};