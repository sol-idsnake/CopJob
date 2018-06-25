const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const departmentSchema = mongoose.Schema({
	position: {type: String, required: true},
	name: {type: String, required: true},
	link: {type: String, required: true},
	state: {type: String, required: true},
	requirements: {
		age: {type: Number},
		citizenship: {type: String},
		degree: {type: String}
	},
	salary: {type: String, required: true},
	description: {type: String, required: true}
});

departmentSchema.methods.serialize = function() {
	return {
		id: this._id,
		position: this.position,
		name: this.name,
		link: this.link,
		state: this.state,
		requirements: this.requirements,
		salary: this.salary,
		description: this.description
	}
};

// first arg passed to model is capital and singular, whereas mongo looks for the same name in plural and 
// non-capitalized in the collections. E.G 'POST', but the collections name is 'posts'
const Department = mongoose.model('Department', departmentSchema)

module.exports = {Department}