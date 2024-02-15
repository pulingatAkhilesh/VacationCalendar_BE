const express = require('express');
const { getAllUsers, getUserFullName } = require('../controllers/userController');
const router = express.Router();

/* GET users listing. */
router.get('/usersList', getAllUsers);
router.get('/userfullname/:userID', getUserFullName);

module.exports = router;