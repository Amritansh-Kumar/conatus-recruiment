var mongoose = require('mongoose');

var answerSchema = new mongoose.Schema({
        answer: {
            type: String,
            trim: true,
            required: true,
            enum: ['0', '1', '2', '3']
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        question: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Question'
        }
    }, {
        strict: true,
        runSettersOnQuery: true
    });


Answer = mongoose.model('Answer', answerSchema);


module.exports = Answer;
