const express = require("express");
const authController = require('../controllers/auth');

const router = express.Router();
            
router.post('/register', authController.register )

router.post('/login', authController.login )

//router.get('/protected', authController.protected )

router.get('/logOut', authController.logOut )








module.exports = router;