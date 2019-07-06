var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({
    id:Number,
    options: [String],
    solution: {
        type: String,
        trim: true,
        required: false,
        default: ''
    },
    category: {
        type: String,
        trim: true,
        lowercase: true
    },
    questionActive: {
        type: Number,
        default: 1
    }
},
    {
        strict: true,
        runSettersOnQuery: true
});
questionSchema.path('options').validate({
    isAsync : false,
    validator: function (options) {
        return options.length === 4;
    },
    message: 'Each question must have 4 options'
});
module.exports = mongoose.model('Question',questionSchema);