const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const user = require("../model");
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcryptjs = require('bcryptjs');
const flash = require('connect-flash');

router.use(cookieParser('secret'));
router.use(session({
    secret : 'secret',
    maxAge : 3600000,
    resave : true,
    saveUninitialized : true
}))

router.use(passport.initialize());
router.use(passport.session());

router.use(flash());

router.use(function(req,res,next){
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
})

const checkAuth = function(req,res,next){
    if(req.isAuthenticated()){
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
    }
    else{
        res.redirect('/signin');
    }

    next();
}

router.use(bodyParser.json()); 
router.use(bodyParser.urlencoded({ extended: true })); 


// "Sign Up" Page GET request
router.get('/', (req,res)=>{
    res.render("signup", {
        title : "Sign Up | Chat Up"
    })
})

// "Sign In" Page GET Request
router.get('/signin', (req,res)=>{
    res.render("home", {
        title : "Sign-In | Chat Up"
    })
})

// Profile Page GET request
router.get('/profile',checkAuth, (req, res) => {

   user.find({}, (err, allNames) => {
       if(err){
           console.log(err)
           return;
       }

       return res.render("profile",
       {
           title : "Profile",
           'user': req.user,
           'names' : allNames
       })
   })

    
})



// Sign Up Post Data with Authentication
router.post('/register', function(req, res){
    console.log(req.body)
    console.log("name", req.body.name)
    let{name, email, password, confirmPassword} = req.body;
    var err;
    

    if(req.body.name == '' || req.body.email == '' || req.body.password == '' || req.body.password == ''){
        err = "Please fill all the Fields"
        res.render("signup", {"err" : err})
    }

    else if(req.body.password != req.body.confirmPassword){
        err = "Password doesnt Match..!"    
        res.render("signup", {"err" : err})
    }


    user.findOne({email : email}, (err, data) => {
        if(err) throw err;

        if(data){
            console.log("User Exists..")
            err = "User already Exists";

            res.render("signup", {'err' : err})
        }
        else{
            bcryptjs.genSalt(10, (err, salt) => {
                if(err) throw err;
                bcryptjs.hash(password, salt, (err, hash) => {
                    if(err) throw err;
                    password = hash;
                    user({
                        email,
                        name,
                        password
                    }).save((err, data) => {
                        if(err) throw err;
                        req.flash('success_message', "Registered Successfully.....")
                        res.redirect('/signin');
                    })
                })
            })
            
            
        }
    })

 }); 

// Authentication Strategy

// Sign In Passport Strategy
var localStrategy = require('passport-local').Strategy;
passport.use(new localStrategy({ usernameField : 'email'}, (email, password, done) => {
    user.findOne({ email : email }, (err, data) => {
        if (err) throw err;

        if(!data){
            return done(null, false, {message: "User Doesn't Exist !"});
        }

        bcryptjs.compare(password, data.password, (err, match) => {
            if(err){
                return done(null, false)
            }
            if(!match){
                return done(null, false, {message: "Password doesnt match !"})
            }
            if(match){
                return done(null, data)
            }
        });
    });
}));

// Serializing User
passport.serializeUser(function(user, cb){
    cb(null, user.id);
});

// DeSerializing User
passport.deserializeUser(function(id, cb){
    user.findById(id, function(err, user){
        cb(err, user);
    })
})


//  Authentication Ends



// Sign In Post request
router.post('/signin', (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect : '/signin',
        successRedirect : '/profile',
        failureFlash : true
    })(req, res, next);
})


router.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/signin');
})



module.exports = router;