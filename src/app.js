const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./middleware/auth-middleware');
const admin = require('./middleware/admin-middleware');
const cors = require('cors');

const userController = require('./controllers/user-controller');
const questionController = require('./controllers/question-controller');
const answerController = require('./controllers/answer-controller');

const app = express();

// CORS Setup
const allowedOrigins = [
    "https://teamconatus.com",
];


app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(undefined, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: [
        "GET",
        "HEAD",
        "PUT",
        "PATCH",
        "POST",
        "DELETE"
    ]
}));
app.options("*");

// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// test route
app.get('/test', (req, res) => {
    res.send('woking fine');
});

/*
* user routes
*/
app.post('/users', userController.userSignUp);

app.get('/users/me', auth, userController.showMe);

app.post('/users/login', userController.userLogin);

app.post('/users/logout', auth, userController.userLogout);

app.get('/users/:user_id/answers', admin, userController.indexAnswers);

/**
 * question routes
 */
app.get('/questions', auth, questionController.indexQuestion);

app.post('/questions', admin, questionController.storeQuestion);

/**
 * Answer routes
 */
app.post('/answers', auth, answerController.storeAnswer);

app.post('/answersupdate', auth, answerController.BulkUpdateAnswers);

module.exports = app;

