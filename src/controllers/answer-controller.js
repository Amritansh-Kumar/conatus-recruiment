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

// const score = async(req,res)=>{
//     try{
//         var calc = req.body;
//         var User = calc.filter("question")
//     }
// }
const BulkUpdateAnswers = async (req, res) => {
    try {
        var ops = req.body.map(function (item) {
            return {
                "updateOne": {
                    "filter": {
                        "question": item.question,
                        "user": item.user,
                    },
                    "update": item,
                    "new": true,
                    "upsert": true
                }
            }
        });

// Get the underlying collection via the native node.js driver collection object
        const answer = await Answer.collection.bulkWrite(ops);

        res.status(200).send({answer});
    } catch (err) {
        res.status(400).send({Error: err.message});
    }
};


module.exports = {
    storeAnswer,
    BulkUpdateAnswers
};
