const express = require('express');
const { getAllUsers, getUserFullName, createVacation, getUserVacationData } = require('../controllers/userController');
const { userAuth } = require('../middlewares/authorization');
const router = express.Router();

/* GET users listing. */
router.get('/usersList', userAuth, getAllUsers);
router.get('/userfullname/:userID', userAuth, getUserFullName);
router.get('/getUserVacationData/:uId', getUserVacationData);

router.post('/createVacation', userAuth, createVacation);

module.exports = router;