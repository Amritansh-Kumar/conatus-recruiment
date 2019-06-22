const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./middleware/auth-middleware');
const userController = require('./controllers/user-controller');

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


module.exports = app;