'use strict'

const express = require('express');
const app = express();
const departmentRouter = require('./departmentRouter');
const mongoose = require('mongoose');
const {PORT, DATABASE_URL} = require('./config');

// const bodyParser = require('body-parser')
// const jsonParser = bodyParser.json()

// Use express.json for POST method
app.use(express.static('public'));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/public.html')
})

app.get("/index", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/portal", (req, res) => {
  res.sendFile(__dirname + '/views/portal.html')
})

app.use("/", departmentRouter);

app.use("*", function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err)
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`)
        resolve()
      })
        .on('error', err => {
          mongoose.disconnect()
          reject(err)
        })
    })
  })
};

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);          
        }
        resolve();
      });
    });
  })
};

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = { app, runServer, closeServer };