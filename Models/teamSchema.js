const mongoose = require("mongoose");
const teamRoles = require('../constants/roles');

// Define teamSchema
const teamSchema = mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        unique: true,
    },
    roles: [
        {
            roleName: {
                type: String,
                required: true,
                enum: teamRoles,
                validate: {
                    validator: function(value){
                        // Check if the roleName is "administrator" only for the "dba" team.
                        return !(this.teamName === "dba" && value !== "administrator");
                    },
                    message: 'Invalid role for the Team.',
                },
                
            },
            members: [
                {
                    userID: {
                        type: String,
                        required: true,
                    },
                },
            ]
        },
    ],
});

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;