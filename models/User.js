const mongoose = require('mongoose')

const userSchema = {
	email: {
		type: String,
		required: true
	},
	userName: {
		type: String
	},
	password: {
		type: String
	},
	createdAt: {
		type: Date
	}
}

module.exports = mongoose.model('User', userSchema)