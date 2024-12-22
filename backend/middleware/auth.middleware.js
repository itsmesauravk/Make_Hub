const User = require('../models/user.models')
const jwt = require('jsonwebtoken');


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').split(' ')[1];
        if (!token) return res.status(400).json({message: 'Unauthorized Request'});
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return res.status(400).json({message: 'Unauthorized Request'});

        const userId = decoded.id;

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({message: 'Unauthorized Request'});

        req.user = user;
        next();

    } catch (e) {
        res.status(500).json({success:false, message: e.message});
    }

}

module.exports = auth;