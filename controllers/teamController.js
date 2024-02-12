const TEAM = require('../Models/teamSchema');
const PREDEFINED_ROLES = require('../constants/roles');

// GET all Teams.
const getTeams = async (req, res) => {
    try{
        const teams = await TEAM.find();
        res.status(200).json(teams);
    }catch(error){
        res.status(500).json({ error: error.message });
    };
};

// GET all predefined Roles for creating a Team.
const getPredefinedRoles = async (req, res) => {
    try{
        res.status(200).json({ PredefinedRoles: PREDEFINED_ROLES });
    }catch(error){
        res.status(500).json({ error: error.message });
    };
};

// Create a new Team.
const createTeam = async (req, res) => {
    try{
        const newTeam = new TEAM(req.body);
        await newTeam.save();
        res.status(200).json(newTeam);
    }catch(error){
        res.status(500).json({ error: error.message });
    };
};

// Add a user under selected Team > Role
const addUserToTeamRole = async (req, res) => {
    try{
        const { userID, teamName, roleName } = req.body;

        // Find the team by name.
        const team = await TEAM.findOne({ teamName });
        if(!team){
            return res.status(404).json({ error: 'Team not found.' });
        };

        // Fine the role withing the team's roles array.
        const role = team.roles.find(role => role.roleName === roleName);
        if(!role){
            return res.status(404).json({ error: 'Role not found.' });
        };

        // Check if the user already exists in the role.
        const existingUser = role.members.find(member => member.userID === userID);
        if(existingUser){
            return res.status(400).json({ error: 'User already exists in the role.' });
        };

        // Add the user to the role.
        role.members.push({ userID });
        await team.save();

        res.status(200).json({ message: 'User successfully added to role.' });
    }catch(error){
        console.error('Error adding user to role:', error);
        res.status(500).json({ error: 'Internal server error.' });
    };
};

module.exports = {
    getTeams,
    getPredefinedRoles,
    createTeam,
    addUserToTeamRole,
};