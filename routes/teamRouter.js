const express = require('express');
const { getTeams, createTeam, getPredefinedRoles, getUsersFromTeams, getUsersFromTeam } = require('../controllers/teamController');
const { userAuth } = require('../middlewares/authorization');
const router = express.Router();

router.get('/teams', userAuth, getTeams);
router.get('/predefinedRoles', userAuth, getPredefinedRoles);
router.get('/getUsersFromTeams/teamUsers', userAuth, getUsersFromTeams);
router.get('/getUsersFromTeam/:team_id', userAuth, getUsersFromTeam);

module.exports = router;