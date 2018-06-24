const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Department} = require('./models');
const app = express();
mongoose.Promise = global.Promise;

// Use for POST method
// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();

app.use(express.json());

router.get('/list', (req, res) => {
	Department
		.find()
		.then(departments => {
			res.json(departments.map(department => department.serialize()))
		})
		.catch(err => {
			console.error(err)
			res.status(500).json({ message: 'Internal server error' })
		})
});

module.exports = router;