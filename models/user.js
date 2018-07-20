var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

var userSchema = mongoose.Schema({
	local: {
	  email: { type: String, required: true },
	  password: { type: String, required: true }
	}
});

// userSchema.methods.serialize = function() {
// 	return {
// 		id: this._id,
// 		email: this.email
// 	}
// }

// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(11), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model("User", userSchema);
