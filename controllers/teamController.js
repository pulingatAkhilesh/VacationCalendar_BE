const jwt = require('jsonwebtoken');
const util = require('util');
const TEAM = require('../Models/teamSchema');
const PREDEFINED_ROLES = require('../constants/roles');
const USERS = require("../Models/userSchema");

// Get userID from db.
const getUserIDFromDB = async (_id) => {
    try{
        const user = await USERS.findById(_id);
        if(user){
            return user.userID;
        }else{
            console.log('User does not exist.');
            return null;
        };
    }catch(error){
        console.error('Error fetching user:', error);
        throw error;
    };
};

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
    console.log('req: ', req);
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

// Function to extract all teams in which the logged-in user added.
const getUserTeams = async (req, res) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const decodedToken = await util.promisify(jwt.verify)(token, 'vacationcalendar');
        
        const uId = decodedToken.uId;
        const userID = await getUserIDFromDB(uId);
        const userTeams = await TEAM.find({ 'roles.members.userID': userID });
        console.log('getUserTeams - userTeams: ', userTeams)
        
        res.status(200).json(userTeams);
        // return userTeams;
    } catch (error) {
        console.error(error);
        throw error; // Rethrowing the error
    }
};


// Function to extract userIDs from each team.
const getUsersFromTeams = async (req, res) => {
    try {
        const userTeams = await getUserTeams(req, res);
        const userIDsByTeam = userTeams.map(team => {
            return {
                teamName: team.teamName,
                userIDs: extractUserIDs(team)
            };
        });
        res.status(200).json(userIDsByTeam);
    } catch (error) {
        console.error('Error retrieving users from teams:', error);
        res.status(500).json({ message: 'Server error.' });
    };
};

// Function to extract userID from a team's roles.
const extractUserIDs = (team) => {
    const userIDs = [];
    team.roles.forEach(role => {
        role.members.forEach(member => {
            userIDs.push(member.userID);
        });
    });
    return userIDs;
};

module.exports = {
    getTeams,
    getPredefinedRoles,
    createTeam,
    addUserToTeamRole,
    getUserTeams,
    getUsersFromTeams,
};