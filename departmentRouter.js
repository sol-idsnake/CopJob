const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Department} = require('./models');
const app = express();
mongoose.Promise = global.Promise;

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

router.post('/create', (req, res) => {
	const requiredFields = ["name", "link", "state", "salary", "description"];
	for(let i=0; i < requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in req.body)){
			const message = `Missing \`${field}\` field in request body`;
			console.error(message);
			return res.status(400).send(message);
		};
	};

	Department
		.create({
			name: req.body.name,
			link: req.body.link,
			state: req.body.state,
			requirements: req.body.requirements,
			salary: req.body.salary,
			description: req.body.description
		})
		.then(post => res.status(201).json(post.serialize()))
		.catch(err => {
			console.error(err)
			res.status(500).json({message: 'Internal server error'})
		})
		
})

module.exports = router;