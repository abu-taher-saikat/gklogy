const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport')


// load user model
const User = require('./../models/User');


// User login route
router.get("/login",(req, res)=>{
    // res.send('login')
    res.render('users/login')
})


router.get("/register",(req, res)=>{
    res.render('users/register');
})


module.exports = router;