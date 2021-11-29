const JwtStrategy = require('passport-jwt').Strategy 
const ExtractJwt = require('passport-jwt').ExtractJwt
const User  = require('../models/User')
const conn = require('../config/sqlconnection')


let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.SECRET

module.exports = (passport) => {
	passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
		conn.query('SELECT * FROM users where UserId = ? LIMIT 1', [jwt_payload.id],
		(error, user, fields) => {
			if((user != null || user != 0) && !error){
				return done(null, user)
				} else {
					return done(null, false)
				}
			})
		})
	)}
	
