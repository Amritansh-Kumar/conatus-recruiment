const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const uniqueValidator = require ('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        uniqueCaseInsensitive: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Please enter a proper email');
            }
        }
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength:10,
        validate(value) {
            if (!validator.isMobilePhone(value, ['en-IN'])) {
                throw new Error('Please enter a valid mobile number')
            }
        }
    },
    branch: {
        type: String,
        enum: ['CSE', 'IT'],
        default: 'CSE',
    },
    student_number: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength:7,
    },
    roll_number: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength:10,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
    },
    token: {
        type: String,
        required: true
    }
}, {
        timestamps: true
    });
userSchema.plugin(uniqueValidator, { message: 'Error, {PATH} already exits' });
    

/**
 * Customizing user return object 
 */    
userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;

    return userObject;
}    


/**
 * Generation jwt auth token to be provide for all the request
 */
userSchema.methods.generateAuthToken = async function () {
    const user = this;

    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);

    user.token = token;
    await user.save();

    return token;
}


/**
 *  using jwt token provided by the user to 
 */
userSchema.statics.authenticate = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to Login!');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error('Unable to Login');
    }
    

    return user;
}

/**
 * Hasing the password before storing it
 */
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;