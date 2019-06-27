const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./middleware/auth-middleware');
const userController = require('./controllers/user-controller');
const Questions = require('./questions/question');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// test route
app.get('/test', (req, res) => {
    res.send('woking fine');
})

/**
 * user routes
 */
app.post('/users', userController.userSignUp);

app.get('/users/me', auth, userController.showMe);

app.post('/users/login', userController.userLogin);

app.post('/users/logout', auth, userController.userLogout);

app.post('/questions',(req,res)=>{
    var data = fs.readFileSync("file.txt", "UTF-8");
    res.send(data);
    var perPage = 1;
    var page = req.params.page || 1;

    Questions
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, questions) {
            Questions.count().exec(function(err, count) {
                if (err) return next(err)
                res.json('/Questions', {
                    questions: questions,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
});
module.exports = app;