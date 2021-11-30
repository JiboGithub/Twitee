const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const validateRegisterInput = require('../auth/register')
const validateLoginInput = require('../auth/login')
const sendWelcomeEmail = require('../config/email')
const conn = require('../config/sqlconnection')



router.route('/register')
	.post((req, res) => {
		const { isValid, errors } = validateRegisterInput(req.body)

		if (!isValid) {
			return res.status(404).json(errors)
		}

		var email = req.body.email;
		var userName = email.substring(0, email.indexOf("@"));

		conn.query('SELECT * FROM users where Email = ? LIMIT 1', [req.body.email],
		(error, rows, fields) => {
			if(rows.length != 0){
				errors.email = 'Email is registered by another user!'
				return res.status(404).json(errors)
			}
			
			let newUser = new User();
			newUser = {
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 10),
			userName: userName
		};
		var sql = `INSERT INTO users (Name, Email, Password, DateCreated)
		values(?,?,?, NOW())`;
		conn.query(sql, [newUser.userName, newUser.email, newUser.password],
			(error, rows, fields) => {
				if(error){
					return res.status(404).json(error)
				}
			})

			if(res.statusCode == 200){
				sendWelcomeEmail(email, userName, "Twitee", 
				"Account Activation", `Welcome to Twitee ${userName}, Your account has been created`);
				return res.status(200)
				.json({ message: "Registration Successful, A welcome email was sent to you, Kindly check spam, if not in inbox", 
				status: res.statusMessage, record: newUser })
			}
			return res.status(500)
				.json({ message: "Registration Failed", 
				status: res.statusMessage 
			})
		})
	});






router.route('/login')
	.post((req, res) => {
		const { errors, isValid } = validateLoginInput(req.body)

		if (!isValid) {
			return res.status(404).json(errors)
		}

		conn.query('SELECT * FROM users where Email = ? LIMIT 1', [req.body.email], 
		(error, rows, fields) => {
			const result = JSON.parse(JSON.stringify(rows))
	
			if(rows.length > 0){
				const email = result[0].Email;
				const userid = result[0].UserId;
				bcrypt.compare(req.body.password, result[0].Password)
				.then(isMatch => {
				if (isMatch) {
					const token = jwt.sign({ id: userid, email: email}, process.env.SECRET, { expiresIn: '1d' }, function (err, token) {
						return res.json({
							message: 'Login Successful',
							name: result[0].Name,
							email: result[0].Email,
							success: true,
							token: token
						})
					})
				} 
				else {
					errors.password = 'Password is incorrect'
					return res.status(404).json(errors)
				}
			})
		} else {
			errors.email = 'User not found'
			return res.status(404).json(errors)
		}
	})
})



router.route('/')
	.get( passport.authenticate('jwt', { session: false }),(req, res) => {
		res.json({
			userId: req.user[0].UserId
		})
})


router.route('/search')
	.post((req, res) => {
		conn.query(`SELECT * FROM users WHERE Name = ? or Email = ?`, 
		[req.query.userName, req.query.email], 
		(error, user, fields) => {
			var result = JSON.parse(JSON.stringify(user))
			if(user.length > 0){
				return res.send(result)
			} else {
				return res.status(404).json({ msg: 'User not found'})
			}
		})
})


router.route('/:id')
	.get((req, res) => {
		conn.query('SELECT * FROM users where UserId = ? LIMIT 1', [req.params.id], 
		(error, user, fields) => {
			var result = JSON.parse(JSON.stringify(user))
			
			if(user.length > 0){
				return res.json({
					userId: result[0].UserId,
					email: result[0].Email,
					userName: result[0].Name,
				})
			} else {
					return res.status(404).json({ msg: 'User not found'})
				}
			})
})


router.get('/getAll', (req, res) => {
	conn.query('SELECT * FROM users', (error, rows, fields) => {
		res.send(rows);
	})
})

module.exports = router