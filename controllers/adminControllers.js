const TEAM = require('../Models/teamSchema');

const createTeam = async (req, res) => {
    try{
        // Assuming req.query.roles is a comma-separated string like "TeamLead,TeamMember, administrator".
        const rolesArray = req.query.roles.split(',');

        const team = new TEAM({
            teamName: req.query.teamName,
            roles: rolesArray.map(role => ({ roleName: role })),
        });
        await team.save();
        res.status(200).json('Team creation successful.')
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}