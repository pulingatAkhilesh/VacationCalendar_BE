const USERS = require('../Models/userSchema');

// GET all Teams.
const getAllUsers = async (req, res) => {
    try{
        const usersList = await USERS.find();
        res.status(200).json(usersList);
    }catch(error){
        res.status(500).json({ error: error.message });
    };
};

// Get fullName of the given userID.
const getUserFullName = async (req, res) => {
    try{
        const { userID } = req.params;
        console.log('========================================');
        console.log('getUserFullName - req: ', req);
        console.log('getUserFullName - req.params: ', req.params);
        const user = await USERS.findOne({ userID: userID }).select('fullName');
        console.log('getUserFullName - user: ', user);
        if(!user){
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ fullName: user.fullName });
    }catch(error){
        console.error('Error fetching user full name: ', error);
        res.status(500).json({ message: 'Server error.' });
    };
};

module.exports = { getAllUsers, getUserFullName };