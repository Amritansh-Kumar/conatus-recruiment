const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

const admin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const tokenDecode = jwt.decode(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: tokenDecode._id, 'token': token});

        if (!user) {
            throw new Error('Please Authenticate!');
        }

        if (user.email !== "admin@conatus.com") {
            throw new Error('You are not Authorized to perform this action!');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({Error: error.message})
    }
};

module.exports = admin;
