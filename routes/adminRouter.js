const express = require('express');
const router = express.Router();

const multer = require('multer');
const { adminAuth } = require('../middlewares/authorization');
const { createTeam, addUserToTeamRole } = require('../controllers/teamController');
const { createAdmin, registerUser } = require('../controllers/authController');

router.post('/createAdmin', createAdmin);

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '')
    },
    fileName: (req, file, cn) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: fileStorage });

router.post('/createTeam', adminAuth, createTeam);
router.post('/registerUser', adminAuth, registerUser);
router.post('/addUserToRole', adminAuth, addUserToTeamRole);

module.exports = router;