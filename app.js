const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash')
const methodeOverride = require('method-override');
const path = require('path');
const passport = require('passport');


const app = express();

// Load router
const users = require('./router/users');
const questions = require('./router/questions');


// Passprot
require('./config/passport')(passport);

// mongo atlas
const atlas = 'mongodb+srv://saikat:saikat1095@cluster0-htwdq.mongodb.net/gklogy?retryWrites=true&w=majority';

// connect to mongo db
mongoose.connect(atlas, {
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(()=> console.log('Mongodb connectd'))
.catch(err => console.log(err))


// handlebars middlewares
app.engine('handlebars', exphbs({
    defaultLayout : 'main',
    // handlebars : allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyparser.urlencoded({extended : false}))
app.use(bodyparser.json());


// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// override middleware
app.use(methodeOverride('_method'));

// Express session middleware
app.use(session({
    secret : "secret",
    resave : true,
    saveUninitialized : true
}))

// useing passport middleware
app.use(passport.initialize());
app.use(passport.session());

// useing flash middleware
app.use(flash());
// making global variable with flash
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})




// user router 
app.use('/users', users);
app.use('/questions', questions);


app.get('/',(req, res)=>{
    // res.send("done")
    res.render('index');
})








const port = 4000;
app.listen(port, ()=>{
    console.log(`Server started on ${port}`);
})