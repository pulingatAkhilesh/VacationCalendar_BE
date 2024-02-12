const USERS = require('../Models/userSchema');

// GET all Teams.
const getAllUsers = async(req, res) => {
    try{
        const usersList = await USERS.find();
        res.status(200).json(usersList);
    }catch(error){
        res.status(500).json({ error: error.message });
    };
};

module.exports = { getAllUsers };