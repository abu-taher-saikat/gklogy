const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create Schema
const QuestionSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    answer : {
        type : String,
        required : true
    },
    user : {
        type : String,
        default : Date.now
    }
})

const Question = mongoose.model('questions', QuestionSchema);
module.exports = Question;