const Question = require('../models/question-model');

const indexQuestion = async (req, res) => {
    try {
        const questions = await Question.find({});

        shuffleQuestions(questions);

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

function shuffleQuestions(questions){
    questions.sort(() => Math.random() - 0.5);
}

module.exports = {
    storeQuestion,
    indexQuestion
};
