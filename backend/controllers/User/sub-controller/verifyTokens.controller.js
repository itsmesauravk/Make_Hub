const User = require('../../../models/user.models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {sendVerificationCode} = require('../../../Utils/mailSend');



// validate resetToken (first time sent)

const verifyResetToken = async (req, res) => {
    try {
        const {verifyToken, otp} = req.body;
        
        if(!verifyToken || !otp){
            return res.status(400).json({success: false, message: "Invalid request"})
        }
        const decoded = jwt.verify(verifyToken, process.env.JWT_VERIFY_SECRET);
        if(!decoded){
            return res.status(400).json({success: false, message: "Token Expired"})
        }
        const user = await User.findById(decoded._id);
        if(!user){
            return res.status(404).json({success: false, message: "Unauthorized request"})
        }
     

        if(user.otp !== Number(otp)){
            return res.status(400).json({success: false, message: "Invalid OTP"})
        }
        const resetToken = jwt.sign({_id: user._id}, process.env.JWT_RESET_SECRET, {expiresIn: process.env.RESET_SECRET_EXPIRY});

        return res.status(200).json({success: true, message: "Email verified successfully", resetToken});


    } catch (error) {
        return res.status(500).json({success: false, message: "Token Expired", error: error.message});
        
    }

}


// resend OTP
const resendOTP = async (req, res) => {
    try {
        const {verifyToken} = req.body;

        if(!verifyToken){
            return res.status(400).json({success: false, message: "Invalid request"})
        }
        const decoded = jwt.verify(verifyToken, process.env.JWT_VERIFY_SECRET);
        if(!decoded){
            return res.status(400).json({success: false, message: "Token Expired"})
        }
        const user = await User.findById(decoded._id);
        if(!user){
            return res.status(404).json({success: false, message: "Unauthorized request"})
        }

        // Generate OTP (6 digits)
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Update user's profile with the OTP
        user.otp = otp;
        const updateUser = await user.save();

        if(!updateUser){
            return res.status(500).json({success: false, message: "Failed to resend OTP"})
        }

        // Send the OTP via email
        const mailSend = await sendVerificationCode(user.email, otp);

        if(!mailSend){
            return res.status(500).json({success: false, message: "Failed to send the verification email, please try again"})
        }

        return res.status(200).json({success: true, message: "Verification email sent successfully"});
        
    } catch (error) {
        return res.status(500).json({success: false, message: "Token Expired", error: error.message});
        
    }


}


// reset password

const resetPassword = async (req, res) => {
    try {
        const {resetToken, password} = req.body;
        if(!resetToken || !password){
            return res.status(400).json({success: false, message: "Invalid request"})
        }
        const decoded = jwt.verify(resetToken, process.env.JWT_RESET_SECRET);
        if(!decoded){
            return res.status(400).json({success: false, message: "Token Expired"})
        }
        const user = await User.findById(decoded._id);
        if(!user){
            return res.status(404).json({success: false, message: "Unauthorized request"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        user.opt = 0;

        const updateUser = await user.save();

        if(!updateUser){
            return res.status(500).json({success: false, message: "Failed to reset password"})
        }

        return res.status(200).json({success: true, message: "Password reset successfully"});

    } catch (error) {
        return res.status(500).json({success: false, message: "Token Expired", error: error.message});

        
    }
}




module.exports = {verifyResetToken, resendOTP ,resetPassword};