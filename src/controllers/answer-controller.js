const Answer = require('../models/answer-model');
const User = require('../models/user-model');

const storeAnswer = async (req, res) => {
    const answer = new Answer(req.body);
    try {

        const ans = await Answer.findOneAndUpdate(
            {question: req.body.question, user: req.body.user},
            {answer: req.body.answer},
            {new: true, upsert: true});

        res.status(200).send({answer});
    } catch (err) {
        res.status(400).send({Error: err.message});
    }
};


const indexAnswers = async (req, res) => {
    try {
        const userId = req.params.user_id;
        const answers = await Answer.find({user: userId}).populate('question').populate('user').exec((err, result) => {
            if (err) {
                res.status(400).send({Error: err.message});
            }
            res.send({result});
        });
    } catch (err) {
        res.status(400).send({Error: err.message});
    }
};

module.exports = {
    storeAnswer,
    indexAnswers
};
