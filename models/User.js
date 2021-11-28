const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = {
	email: {
		type: String,
		required: true,
		unique: true
	},
	userName: {
		type: String
	},
	password: {
		type: String
	},
	followers: [],
	following: []
}

module.exports = mongoose.model('User', userSchema)