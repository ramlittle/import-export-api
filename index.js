const express=require('express');
const mongoose = require ('mongoose');
const morgan=require('morgan');
const bodyParser=require('body-parser')
const cors = require('cors');
const helmet = require('helmet');
const server  = express();
const port = 8008;

// Middlewares
server.use( morgan('dev') );
server.use( cors() );
server.use( bodyParser.json() );
server.use( helmet() );

// Routes
const UserRouter = require('./routes/users');
const AuthRouter = require('./routes/auth');

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/upliftingdb');


server.get('/', ( request, response ) => {
    response.send(`Welcome to this API`);
});

// endpoints
server.use('/api/v1/auth', AuthRouter );
server.use('/api/v1/users', UserRouter );

server.listen(port, () => {
        console.log(`Server running on port ${ port }`);
    }
);
