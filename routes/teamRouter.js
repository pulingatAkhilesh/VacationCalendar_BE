const express = require('express');
const { getTeams, createTeam, getPredefinedRoles, getUserTeams, getUsersFromTeams } = require('../controllers/teamController');
const { userAuth } = require('../middlewares/authorization');
const router = express.Router();

router.get('/teams', userAuth, getTeams);
router.get('/predefinedRoles', userAuth, getPredefinedRoles);
router.get('/getUserTeams/', userAuth, getUserTeams);
router.get('/getUsersFromTeams/teamUsers', userAuth, getUsersFromTeams);

module.exports = router;