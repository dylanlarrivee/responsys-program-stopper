const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

// Do not need a signup option for this app
// router.get('/signup', authController.getSignup);
// router.post('/signup', authController.postSignup);

module.exports = router;