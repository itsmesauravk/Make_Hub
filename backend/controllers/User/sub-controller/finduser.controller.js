const User = require("../../../models/user.models")

// for displaying users
const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("_id username recipesPosted followers profilePicture")
            .sort({ followers: -1 }) // Sort by followers in descending order
            .limit(8); // Limit to 8 users

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found" });
        }

        return res.status(200).json({ success: true, message: "Users found", users });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}


//searching users
const searchUser = async(userName)=>{
    const users = await User.find({
        $or:[
            {username:{$regex:userName, $options:'i'}},
            {email:{$regex:userName, $options:'i'}},
            {fullname:{$regex:userName, $options:'i'}},
        ]
    });
    return users;
}

const foundUsers = async (req,res)=>{
    try {
        const userName = req.query.term;
        const users = await searchUser(userName);
        if(users.length === 0){
            return res.status(404).json({success:false, message:"No users found"});
        }
        return res.status(200).json({success:true, message:"Users found", users});
    } catch (error) {
        return res.status(500).json({success:false, message:"Server error", error:error.message});   
    }
}


module.exports = {
    getUsers,
    foundUsers
}
