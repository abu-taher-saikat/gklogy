const express = require('express');
const router = express.Router();


// require questions model
const Questions = require('./../models/Question');

// Question index page
router.get('/',(req, res)=>{
    Questions.find({})
    .sort({date : 'desc'})
    .then(questions =>{
        res.render('index',{
            questions :  questions
        })
    })
})

// router.get('/',(req, res)=>{
//     // res.send("done")
//     res.render('index');
// })

// add question from
router.get('/add',(req, res)=>{
    res.render('questions/add');
})

// add question from process
router.post('/',(req, res)=>{
    let errors = [];

    if(!req.body.title){
        errors.push({text : 'Please add a title'})
    }
    if(!req.body.answer){
        errors.push({text : "Please add an answer"});
    }

    if(errors.length > 0){
        res.render('questions/add',{
            errors : errors,
            title : req.body.title,
            answer : req.body.answer
        })
    }else{
        const newQuestion = {
            title : req.body.title,
            answer :  req.body.answer,
            user : req.body.id
        }

        new Questions(newQuestion).save()
        .then(question =>{
            req.flash('success_msg',"Your question and answer posted");
            res.redirect('/');
        })
    }

})


module.exports = router ;