"use strict";

const express = require("express");
const app = express();
const departmentRouter = require("./departmentRouter");
const mongoose = require("mongoose");
const { PORT, DATABASE_URL } = require("./config");

var passport = require("passport");
var flash = require("connect-flash");
var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");

app.use(express.static("public"));
app.use(express.json()); // Use express.json for POST method

require('./config/passport')(passport); // pass passport for configuration
app.use(morgan("dev")); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(
  bodyParser.urlencoded({
    extended: true
  })
); // get information from html forms

// required for passport
app.use(
  session({
    secret: "ThisIsWhatIn2018IleftGpDFor",
    resave: true,
    saveUninitialized: true
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./app/routes.js')(app, passport);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/public.html");
});

app.use("/", departmentRouter);

app.use("*", function(req, res) {
  res.status(404).json({ message: "Not Found" });
});

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on("error", err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
