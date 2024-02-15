const express = require('express');
const router = express.Router();

const multer = require('multer');
const { teamLeadAuth } = require('../middlewares/authorization');
const { addUserToTeamRole } = require('../controllers/teamController');

router.post('/addUserToRole', teamLeadAuth, addUserToTeamRole);

module.exports = router;