const express = require('express')
const dotenv = require('dotenv') 
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')

const users = require('./routers/users')
const posts = require('./routers/posts')

// setup environment
dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

app.use(passport.initialize())
require('./config/passport')(passport)

app.use('/api/users', users)
app.use('/api/posts', posts)

app.listen( 5000, () => {
	console.log( "server has started on port 3000" );
}); 
