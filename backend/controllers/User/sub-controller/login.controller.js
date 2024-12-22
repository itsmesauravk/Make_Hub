const User = require('../../../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;



const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({success:false, message: 'Please fill in all fields' });
    }
    try {
        const checkUser = await User.findOne({ email });
        
        if (!checkUser) {
            return res.status(400).json({success:false, message: 'Invalid credentials' });
        }
        const valid = await bcrypt.compare(password, checkUser.password);
        
        if (!valid) {
            return res.status(400).json({success:false, message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: checkUser._id }, JWT_SECRET);

        
        res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 1000 * 60 * 60 * 24 * 7 })
        res.status(200).json({success:true, token, message: 'Logged in successfully', user: { id: checkUser._id, username: checkUser.username, email: checkUser.email, bio: checkUser.bio } });
    }
    catch (error) {
        res.status(500).json({success:false, message: 'Internal server error ', error: error.message });
    }
}


module.exports = login;