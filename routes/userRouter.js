var express = require('express');
const { getAllUsers } = require('../controllers/userController');
const { addUserToTeamRole } = require('../controllers/teamController');
var router = express.Router();

/* GET users listing. */
router.get('/usersList', getAllUsers);

router.post('/addUserToRole', addUserToTeamRole);

module.exports = router;