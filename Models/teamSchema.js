const mongoose = require("mongoose");

// Define enum values
const teamRoles = [ 'TeamLead', 'TeamMember', 'administrator' ]; // Add more roles as needed.

// Define teamSchema
const teamSchema = mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    roles: [
        {
            roleName: {
                type: String,
                required, true,
                enum: teamRoles,
            },
        },
    ],
    members: [
        {
            userId: {
                type: String,
                required: true,
            },
            role: {
                type: String,
                required: true,
                enum: teamRoles,
            },
        },
    ],
});

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;