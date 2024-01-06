const TEAM = require('../Models/teamSchema');

const createTeam = async (req, res) => {
    try{
        await TEAM({
            teamName: req.query.teamName,
            roleName: req.query.roles,
        }).save()
        res.status(200).json('Team creation successful.')
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}