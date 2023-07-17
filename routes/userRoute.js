const express = require('express');

const router = express.Router();

const {signup, login} = require('../controllers/authController');


router.route('/signup').post(signup);
router.route('/signin').post(login)

module.exports = router;