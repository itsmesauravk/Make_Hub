
const express = require('express');
const router = express.Router();

const { login, register, userInfo, userProfile, inspectUser,
    followController,
    updateProfile, updatePrivacy,
    forgotPassword,
    verifyResetToken,resetPassword,
    resendOTP,
    getUsers, foundUsers

 } = require('../controllers/User/index');
const uploader = require('../Utils/multer');



//routes
router.post('/login', login);
router.post('/signup', register);
router.get('/user-info', userInfo);
router.get('/user-profile/:slug', userProfile)

router.get('/inspect-user/:userId', inspectUser);

//follow , unfollow
router.post('/follow-unfollow', followController);


// profile updates
router.patch('/update-profile', uploader.single('image') ,updateProfile);
router.patch('/update-privacy', updatePrivacy);

//forgot password
router.post('/forgot-password', forgotPassword);

//verify reset token
router.post('/verify-reset-token', verifyResetToken);

//reset password
router.post('/reset-password', resetPassword);

//resend OTP
router.post('/resend-otp', resendOTP);


//find users
router.get('/get-popular-users', getUsers);

// search users
router.get('/find-users', foundUsers);


module.exports = router;