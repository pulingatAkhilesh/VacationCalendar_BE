const Team = require('../Models/teamSchema');

// GET all Teams
const getTeams = async(req, res) => {
    try{
        const teams = await Team.find();
        res.status(200).json(teams);
    }catch(error){
        res.status(500).json({ error: error.message });
    };
};

// Create a new Team
const createTeam = async(req, res) => {
    try{
        const newTeam = new Team(req.body);
        await newTeam.save();
        res.status(200).json(newTeam);
    }catch(error){
        res.status(500).json({ error: error.message });
    };
};

module.exports = {
    getTeams,
    createTeam,
};