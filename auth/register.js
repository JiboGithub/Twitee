const Validator = require('validator')

module.exports = function (data) {
	let errors = {}

	if (Validator.isEmpty(data.email)) {
		errors.email = 'Please enter your email'
	}

	if (!Validator.isEmail(data.email)) {
		errors.email = 'Please enter a valid email address'
	}

	if (Validator.isEmpty(data.password)) {
		errors.password = 'Please enter your password'
	}

	if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
		errors.password = 'Password cannot be less than 7 characters'
	}

	if (Validator.isEmpty(data.confirmpassword)) {
		errors.repassword = 'Password confirmation is required'
	}

	if (!Validator.equals(data.password, data.confirmpassword)) {
		errors.confirmpassword = 'Passwords do not match'
	}

	return {
		errors,
		isValid: Object.keys(errors).length === 0
	}
}