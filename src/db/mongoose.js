const mongoose = require('mongoose');

require('dotenv').config({ path: '.env' });

const connectionUrl = process.env.MONGODB_URL;

mongoose.connect(connectionUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
});

