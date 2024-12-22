const User = require('../../../models/user.models');

const jwt = require('jsonwebtoken');
const {sendVerificationCode} = require('../../../Utils/mailSend');

// forgot password 
const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Check if email is provided
      if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
      }
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Generate OTP (6 digits)
      const otp = Math.floor(100000 + Math.random() * 900000);
  
      // Generate a verification token
      const verifyToken = jwt.sign(
        { _id: user._id },
        process.env.JWT_VERIFY_SECRET,
        { expiresIn: process.env.VERIFY_SECRET_EXPIRY }
      );
  
      // Update user's profile with the OTP
      user.otp = otp;
      const updateUser = await user.save();
      if (!updateUser) {
        return res.status(500).json({ success: false, message: "Something went wrong, please try again" });
      }
  
      // Send the OTP via email
      const mailSend = await sendVerificationCode(email, otp);
      if (!mailSend) {
        return res.status(500).json({ success: false, message: "Failed to send the verification email, please try again" });
      }
  
      // Return success response
      return res.status(200).json({
        success: true,
        message: "Verification email sent successfully",
        verifyToken,
      });
  
    } catch (error) {
      // Handle server errors
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };
  


module.exports = forgotPassword;

