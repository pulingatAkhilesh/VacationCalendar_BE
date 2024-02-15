const express = require('express');
const { getTeams, createTeam, getPredefinedRoles } = require('../controllers/teamController');
const router = express.Router();

router.get('/teams', getTeams);
router.get('/predefinedRoles', getPredefinedRoles);

module.exports = router;