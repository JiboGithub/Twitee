const mysql = require('mysql')

module.exports = mySqlConnection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Legendsmall19',
	database: 'TwiteeDb'

    
})

mySqlConnection.connect((err) => {
    if(!err){
        console.log( "Database Connected" );
    }
    else{
        console.log( err.message );
    }
})