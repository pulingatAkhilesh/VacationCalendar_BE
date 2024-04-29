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

// Get all Teams.
const getTeams = async (req, res) => {
    try{
        const teams = await TEAM.find();
        res.status(200).json(teams);
    }catch(error){
        res.status(500).json({ error: error.message });
    };
};

// Get all predefined Roles for creating a Team.
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
        const { teamName, teamRoles } = req.body;

        // Check if a team with the same name already exists.
        const existingTeam = await TEAM.findOne({ teamName });
        if(existingTeam){
            return res.status(400).json({ error: 'A team with the same name already exists.' });
        };

        // Create a new team.
        const newTeam = new TEAM({ teamName, teamRoles });
        await newTeam.save();

        res.status(201).json({ message: 'Team created successfully.' });
    }catch(error){
        if(error.code === 11000 && error.keyPattern && error.keyPattern.teamName){
            return res.status(400).json({ error: 'A team with the same name already exists.' });
        };
        res.status(500).json({ error: 'Internal server error.' });
    };
};

// Add a user under selected Team > Role
const addUserToTeamRole = async (req, res) => {
    try{
        const { userID, teamName, roleName } = req.body;

        // Find the user in the users collections.
        const user = await USERS.findOne({ userID });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        };

        // Find the team by name.
        const team = await TEAM.findOne({ teamName });
        if(!team){
            return res.status(404).json({ error: 'Team not found.' });
        };

        // Check if the user already exists in the role.
        const existingUser = team.users.find(member => member.userID === userID);
        if(existingUser){
            return res.status(400).json({ error: 'User already exists in the role.' });
        };

        // Add the user to the role.
        team.users.push({
            userID: user.userID,
            user_uId: user._id,
            roleName: roleName
        });
        await team.save();

        res.status(200).json({ message: 'Team and Role successfully assigned to user.' });
    }catch(error){
        res.status(500).json({ error: 'Internal server error.' });
    };
};

// Function to extract all users of all the teams in which the logged-in user added.
const getUsersFromTeams = async (req, res) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const decodedToken = await util.promisify(jwt.verify)(token, 'vacationcalendar');
        const user_uId = decodedToken.uId;
        const teams = await TEAM.find({ 'users.user_uId': user_uId });

        const teamsWithUsers = teams.map(team => {
            const users = team.users.map(user => {
                return {
                    user_uId: user_uId,
                };
            });

            return {
                team_id: team._id,
                teamName: team.teamName,
                users: users,
            };
        });

        res.status(200).json(teamsWithUsers);
        return teamsWithUsers;
    } catch (error) {
        res.status(500).json({ message: 'Server error on getting users data from your teams.' });
    };
};

// Function to extract all users of the given team.
const getUsersFromTeam = async (req, res) => {
    console.log('getUsersFromTeam - req: ', req)
    try {
        const { team_id } = req.params;
        const team = await TEAM.findById(team_id);

        if (!team) {
            return res.status(404).json({ message: "Team not found." });
        }

        const users = team.users;
        console.log('getUsersFromTeam - users: ', users)
        res.status(200).json(users);
    } catch (error) {
        console.error("Error retrieving users from team:", error);
        res.status(500).json({ message: "Server error" });
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
    getUsersFromTeams,
    getUsersFromTeam
};