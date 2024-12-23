const express = require('express');
const axios = require('axios');
const router = express.Router();
const slug = require('slug');


const User = require('../models/user.models');
const jwt = require('jsonwebtoken');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.SERVER_URL}/auth/google/callback`;
// const REDIRECT_URI = `${process.env.CLIENT_URL}/auth/google/callback`;


// Initiates Google Login
router.get('/auth/google', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
});

// Callback Route
router.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange authorization code for access token
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token } = data;

    // Fetch user profile
    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // console.log('Profile:', profile);

    // Check if user exists in your database
    let user = await User.findOne({ email: profile.email });
    const newUsername = profile.email.split('@')[0];

    if(user){
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_SECRET_EXPIRY });
      return res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
    }

    
      // If user does not exist, create a new user
    const newUser = await User.create({
        username: newUsername,
        email: profile.email,
        fullname: profile.name,
        password: profile.id,
        bio: profile.name,
        profilePicture: profile.picture,
      });
      
      // Generate slug from fullname and ObjectId
      const nameSlug = slug(profile.name);
      const userId = newUser._id.toString(); 
      const lastEight = userId.slice(-8); // Get the last 8 characters of the ObjectId
      const userSlug = `${nameSlug}-${lastEight}`;

      newUser.slug = userSlug;
      await newUser.save();
    
    // Handle session creation or JWT token generation
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_SECRET_EXPIRY });

   // sending token as response to frontend
  //  res.status(200).json({success:true,message:"Login Successful", token });
    // Redirect to your frontend or dashboard
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  } catch (error) {
    console.error('Error during Google authentication:', error);
    res.redirect(`${process.env.CLIENT_URL}/login`);
  }
});

module.exports = router;
