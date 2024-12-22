const User = require('../../../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const slug = require('slug');

// register

const register = async (req, res) => {
    const { username, fullname, email, password, bio } = req.body;
    
    if (!username || !fullname || !email || !password) {
        return res.status(400).json({success:false, message: 'Please fill in all fields' });
    }

    try {
        // Check for existing email
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.status(400).json({success:false, message: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user
        const newUser = await User.create({ username, fullname, email, password: hashedPassword, bio });

        if (!newUser) {
            return res.status(400).json({success:false, message: 'Unable to register, try again' });
        }

        // Generate slug from fullname and ObjectId
        const nameSlug = slug(fullname);
        const userId = newUser._id.toString(); 
        const lastEight = userId.slice(-8); // Get the last 8 characters of the ObjectId
        const userSlug = `${nameSlug}-${lastEight}`;

        newUser.slug = userSlug;
        await newUser.save();

        res.status(201).json({success:true, message: 'User created successfully' });

    } catch (error) {
        res.status(500).json({success:false, message: 'Internal server error', error: error.message });
    }
};

module.exports = register;
