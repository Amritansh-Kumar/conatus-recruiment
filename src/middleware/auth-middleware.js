const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        console.log('testing');

        if (!token){
            throw new Error();
        }

        const tokenDecode = jwt.decode(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: tokenDecode._id, 'token': token });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please Authenticate!' })
    }
};

module.exports = auth;
