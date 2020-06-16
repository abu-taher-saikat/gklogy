const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// require questions model
const Questions = require('./../models/Question');

// Question index page
router.get('/',ensureAuthenticated,(req, res)=>{
    Questions.find({user : req.user.id})//for access control
    .sort({date : 'desc'})
    .then(questions =>{
        res.render('index',{
            questions :  questions
        })
    })
})



// add question from
router.get('/add',(req, res)=>{
    res.render('questions/add');
})

// qn
router.get('/qn',(req, res)=>{
    Questions.find({})
    .sort({date : 'desc'})
    .then(questions =>{
        res.render('questions/index',{
            questions :  questions
        })
    })
})

// Edit question from
router.get('/edit/:id',ensureAuthenticated, async (req, res)=>{
    try{
        // const id = req.params.id;
        await Questions.findOne({_id : req.params.id})
        .then(questions =>{
            if(questions.user != req.user.id){
                req.flash('error_msg',"Not Authorized");
                // res.redirect('/questions/edit');
                res.redirect('/');
            }else{
                res.render('questions/edit',{
                    questions : questions
                })
            }
        })
    }catch(err){
        console.log(err);
    }
})



// add question from process
router.post('/',ensureAuthenticated,(req, res)=>{
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


// Edit Form process
router.put('/:id',ensureAuthenticated,(req, res)=>{
    Questions.findOne({_id : req.params.id})
    .then(questions =>{
        // new values
        questions.title = req.body.title;
        questions.answer = req.body.answer;

        questions.save()
        .then(()=>{
            req.flash('success_msg',"question updated");
            // res.redirect("/questions/qn");
            res.redirect("/");
        })
    })
})


// delete questions
router.delete('/:id',ensureAuthenticated, async (req, res)=>{
    // res.send(delete);
    // try{
    //     await Questions.deleteOne({_id : req.params.id})
    //     .then(()=>{
    //         req.flash('success_msg',"Question removed");
    //         res.redirect('/');
    //     })
    // }catch(err){
    //     console.log(err);
    // }
    try{
        // const id = req.params.id;
        await Questions.deleteOne({_id : req.params.id})
        .then(questions =>{
            if(questions.user != req.user.id){
                req.flash('error_msg',"Not Authorized");
                // res.redirect('/questions/edit');
                res.redirect('/');
            }else{
                req.flash('success_msg',"question removed");
                res.redirect('/');
            }
        })
    }catch(err){
        console.log(err);
    }
})


module.exports = router ;