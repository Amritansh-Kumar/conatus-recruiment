const User = require('../models/user-model');
const Answer = require('../models/answer-model');

const userSignUp = async (req, res) => {
    const user = new User(req.body);
    try {
        const token = await user.generateAuthToken();
        await user.save();
        res.status(201).send({user, token});
    } catch (err) {
        res.status(400).send({error: err.message});
    }
};

const userLogin = async (req, res) => {
    try {
        if (req.body.master_password !== process.env.MASTER_PASSWORD) {
            throw new Error('Login attempt failed');
        }
        const user = await User.authenticate(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        res.status(200).send({user, token});
    } catch (error) {
        res.status(400).send({error: 'Login attempt failed'});
    }
};

const userLogout = async (req, res) => {
    try {
        req.user.token = 'undefined';
        await req.user.save();

        res.send();
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
};

const showMe = async (req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
};


const indexAnswers = async (req, res) => {
    try {
        const userId = req.params.user_id;

        const result = await Answer.find({}).populate('user').populate('question')
            .exec(async (err, answers) => {
                console.log(answers);

                var finalResult = [];
                var finalScore = 0;

                await answers.forEach(answer => {
                    if (answer.user._id == userId) {

                        if (answer.question !== null) {

                            if (answer.answer === null || answer.answer === undefined) {

                            } else if (answer.question.solution === answer.answer) {
                                finalScore += 4;
                            } else {
                                finalScore -= 1;
                            }

                            const data = {
                                _id: answer._id,
                                user: answer.user._id,
                                question: {
                                    _id: answer.question._id,
                                    question_id: answer.question.question_id,
                                    solution: answer.question.solution
                                },
                                answer: answer.answer
                            };
                            finalResult.push(data);
                        }
                    }
                });


                res.status(400).send({result: finalResult, score: finalScore});
            });

    } catch (err) {
        res.status(400).send({Error: err.message});
    }

};

module.exports = {
    userSignUp,
    userLogin,
    userLogout,
    showMe,
    indexAnswers
};
