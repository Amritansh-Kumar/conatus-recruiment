const Question = require('../models/question-model');

const indexQuestion = async (req, res) => {
    try {
        const questions = await Question.find({});
        res.status(200).send(questions);
    } catch (err) {
        res.status(400).send(err);
    }
};

const storeQuestion = async (req, res) => {
    const question = new Question(req.body);
    try {
        await question.save();
        res.status(200).send({question});
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

module.exports = {
    storeQuestion,
    indexQuestion
};
