
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const db = require("../dbConnect");



exports.register = (req, res) => {
    console.log(req.body);
    
  
   /* this block of code is the same as the line below as it uses the same variable names
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    */
    const { name, email, password, passwordConfirm } = req.body; 

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error){
            console.log(error);

        }
        if (results.length > 0) {
            return res.render('register', {
                message: 'The email is already in use'
            })
        } else if ( password !== passwordConfirm){
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }
        
        
    
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword }, (error, results) => {
            if(error) {
                console.log(error);

            } else {
                console.log(results);
                return res.render('register', {
                    message: 'User Registered'
            });
            }
    
    
        })   
    })

}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if( !email || !password ){
            return res.status(400).render('login', {
                message: "Please provide an email and password"
            })
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            console.log(results);
            if (results.length !=1 || !(await bcrypt.compare(password, results[0].password)) ) {
                    res.status(401).render('login', {
                    message:"Email or Password is incorrect"
                })
                
         }
            else{ 
                const id = results[0].id;
                const name = results[0].name;

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                })

                console.log("The token is " + token)
                
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.nextTick.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }



                res.cookie('jwt', token, cookieOptions);
                //res.status(200).redirect("/")
                 res.status(400).render('index', {
                    name: name,
                    message:"Logged in as " + name
                })

            
            }
         
            
        })

    } catch (error) {
        console.log(error);
    }

}



exports.logOut = (req,res,) => {
    
    res.clearCookie('jwt').render('index', {
        message: 'You have successsfully logged Out'
    })
   
      

}
