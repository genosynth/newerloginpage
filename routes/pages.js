const express = require("express");
const db = require("../dbConnect");

const router = express.Router();
const jwt = require('jsonwebtoken');


router.get('/', (req, res) => {
    res.render('index');
})

router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get("/protected",  (req, res) => {
    var token = req.cookies.jwt;
    
    if (!token) 
        return res.status(401).render('login', {
            message:"Please log in to view this page"
        })
    
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) 
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      //return res.status(200).send(decoded);
      console.log(decoded);  
      const id = decoded.id

      db.query('SELECT * FROM users WHERE id = ?', [id], async (error, results) => {
        console.log(results);
        
         
            
            const name = results[0].name;

            
            //res.status(200).redirect("/")
            // res.status(200).render('choicechat')

             
             //res.status(200).redirect("/")
              res.status(400).render('choiceChat', {
                 name: name,
                 message:"Logged in as " + name
             })
        
     
        
    })

      //return res.render('protected', {
        //message: 'Welcome'
});
  
})


router.get("/chat",  (req, res) => {
    var token = req.cookies.jwt;
    if (!token) 
        return res.status(401).render('login', {
            message:"Please log in to view this page"
        })
    
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) 
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      //return res.status(200).send(decoded);
      console.log(decoded);  
      const id = decoded.id

      db.query('SELECT * FROM users WHERE id = ?', [id], async (error, results) => {
        console.log(results);
        
         
            
            const name = results[0].name;

            
            //res.status(200).redirect("/")
             res.status(200).render('chat')

        
        
     
        
    })

      //return res.render('protected', {
        //message: 'Welcome'
});
  
})

module.exports = router;