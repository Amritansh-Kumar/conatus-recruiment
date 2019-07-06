const User = require('../models/user-model');

const userSignUp = async (req, res) => {
    const user = new User(req.body);
    try {
        const token = await user.generateAuthToken();
        await user.save();
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send({error: "Email already registered!"});
    }
};

const userLogin = async (req, res) => {
    try {
        if (req.body.master_password !== process.env.MASTER_PASSWORD) {
            throw new Error('Login attempt failed');
        }
        const user = await User.authenticate(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        res.status(200).send({ user, token });
    } catch (error) {
        res.status(400).send({error:'Login attempt failed'});
    }
};

const userLogout = async (req, res) => {
    try{
        req.user.token = 'undefined';
        await req.user.save();

        res.send();
    }catch(error){
        console.log(error)
        res.status(500).send();
    }
};

const showMe = async (req, res) => {
    try{
        res.send(req.user);
    }catch(error){
        console.log(error)
        res.status(500).send();
    }
};

const indexAnswers = async (req, res) => {
  try {
      const userId = req.params.user_id;
      const user = await User.findById(userId);
      await user.populate('answers').execPopulate();
      res.status(200).send({user, answers: user.answers});
  }  catch (err) {
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
