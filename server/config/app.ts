/*
 * Name: Salvi Patel
 * Course Code - INFT 2202-02
 * In Class-4 : Mongoose and MongoDB Atlas
 * Date: April 17, 2024
*/

// importing  all dependencies
import createError from 'http-errors';
import express, {NextFunction} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose'; // Importing the package to interact with MongoDB Database.

/**
 * Importing the routes from the "routes" file.
 * Importing the router instance
 */
import indexRouter from '../routes';
import usersRouter from '../routes/users';

// importing session, passport, passportLocal and flash

import session from "express-session"; // Cookie based session
import passport from "passport"; // Authentication Support
import passportLocal from "passport-local"; // Authentication Strategy (BASIC AUTH)
import flash from "connect-flash"; // Authentication Messaging

let localStrategy = passportLocal.Strategy;

//ts-ignore
import  User from "../models/user";


/**
 * Creating instance for Express Application
 */
const app = express();
/**
 * Importing the Database Configuration
 */
import * as DBConfig from './db';

/**
 * Using the mongoose .connect() to MongoDB database
 */
mongoose.connect(DBConfig.URI);


const db = mongoose.connection;

/**
 * If the database connection encounters an error it shows error message.
 */
db.on('error', function() {
  console.error("Connection Error")
});

/**
 * If the database connection encounters an open event it opens an event handler
 */
db.once("open", function()
{

  console.log(`Connected to MongoDB at ${DBConfig.HostName}`)
});

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
//????
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //??
app.use(cookieParser());
/**
 * Setting the folders static path
 * so we don't to write "absolute path"
 */
app.use(express.static(path.join(__dirname, "../../client")));        // server static files from client directory
app.use(express.static(path.join(__dirname, "../../node_modules")));  // serve static files from node_modules directory

/**
 * Configuring the Express Application to use the Session Management.
 */
app.use(session(
    {
    secret : DBConfig.SessionSecret, // Secret Key for Checking whether the changes have been made it or not.
    saveUninitialized: false,
    resave: false
    }
))
/**
 * Configuring the Express Application to use the flash
 */
app.use(flash());
/**
 * Configuring the Express Application to use "passport for authentication purpose"
 */
app.use(passport.initialize());

app.use(passport.session());

/**
 * Configuring the Passport to use local Strategy
 */
passport.use(new localStrategy(User.authenticate()));

/**
 * HACK
 * node_modules --> @types --> passport
 * Line 468 (Express.user ---> any)
 */
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())


app.use('/', indexRouter);
app.use('/users', usersRouter);


app.use(function(req, res, next)
{
  next(createError(404));
});

/**
 * This is for Error Handler Middleware function
 */
app.use
(
    function(err : createError.HttpError, req: express.Request,res : express.Response, next : NextFunction)
    {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    }
);

// exporting default app.
export default app;