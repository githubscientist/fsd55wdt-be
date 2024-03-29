// require express dependency
const express = require('express');
// import cors
const cors = require('cors');
// require the user routes
const userRouter = require('./routes/userRoutes');
// require the job routes
const jobRouter = require('./routes/jobRoutes');
// require morgan for logging
const morgan = require('morgan');
// require cookie-parser for parsing cookies
const cookieParser = require('cookie-parser');


// create an express application
const app = express();

// middlewares
// use the cors middleware
// for production
app.use(cors({
    origin: 'https://fsd55fe.netlify.app',
    credentials: true,
}));
// use morgan for logging
app.use(morgan('dev'));
// use cookie-parser
app.use(cookieParser());
// parse the request body as JSON
app.use(express.json());

// routes middlewares
// define the endpoints
app.use('/api/users', userRouter);
app.use('/api/jobs', jobRouter);

// export the app
module.exports = app;