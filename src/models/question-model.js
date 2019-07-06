var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({
        question_id: {
            type: Number,
            unique: true,
            trim: true,
            required: false,
        },
        options: [
            String
        ],
        solution: {
            type: String,
            trim: true,
            required: true,
            enum: ['0', '1', '2', '3']
        },
        category: {
            type: String,
            trim: true,
            lowercase: true
        },
        question: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        strict: true,
        runSettersOnQuery: true
    });

// validating option field
questionSchema.path('options').validate({
    isAsync: false,
    validator: function (options) {
        return options.length === 4;
    },
    message: 'Each question must have 4 options'
});


questionSchema.pre('save', async function (next) {
    const question = this;

    try {
        const data = await question.constructor.countDocuments({});
        question.question_id = data + 1;
        next();
    } catch (e) {
        next(e);
    }
    // question.constructor.countDocuments({}, (err, data) => {
    //     if (err) {
    //         next(err);
    //     }
    //
    //
    // });
});


Question = mongoose.model('Question', questionSchema);


module.exports = Question;
