const express = require('express');
const router = express.Router();

const multer = require('multer');
const { adminAuth } = require('../middlewares/authorization');
const { createTeam } = require('../controllers/teamController');

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

module.exports = router;