const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get('/protected', function(req, res) {
    var token = req.cookies.jwt;
    if (!token) 
        return res.status(401).render('login', {
            message:"Please log in to view this page"
        })
    
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) 
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      //res.status(200).send(decoded);
      return res.render('protected', {
        message: 'Welcome'
});
    });
});

router.get('/', (req, res) => {
    res.render('index');
})

router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/login', (req, res) => {
    res.render('login');
})






module.exports = router;