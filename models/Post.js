const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = {
	user: {
		type: Schema.Types.Object,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date
	}
}


module.exports = mongoose.model('Post', postSchema)

