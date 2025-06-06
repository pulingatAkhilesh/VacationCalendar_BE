const express = require('express');
const { getAllUsers, getUserFullName, createVacation, getUserVacationData, getUserTeams, deleteVacationDate } = require('../controllers/userController');
const { userAuth } = require('../middlewares/authorization');
const router = express.Router();

/* GET users listing. */
router.get('/usersList', userAuth, getAllUsers);
router.get('/userfullname/:user_uId', userAuth, getUserFullName);
router.get('/getTeamsOfUser/:user_uId', userAuth, getUserTeams);
router.get('/getUserVacationData/:user_uId', getUserVacationData);

router.post('/createVacation', userAuth, createVacation);

router.delete('/deleteVacationDate/:user_uId', deleteVacationDate);

module.exports = router;