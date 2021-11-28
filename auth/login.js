const Validator = require('validator')

module.exports = function (data) {
	let errors = {}

	if (Validator.isEmpty(data.email)) {
		errors.email = 'Please enter your email to continue..'
	}

	if (!Validator.isEmail(data.email)) {
		errors.email = 'Sorry, Email is incorrect'
	}

	if (Validator.isEmpty(data.password)) {
		errors.password = 'Please enter your password to continue'
	}

	if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
		errors.password = 'Password cannot be less than 7 characters'
	}

	return {
		errors,
		isValid: Object.keys(errors).length === 0
	}
}