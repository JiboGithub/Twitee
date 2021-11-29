const mysql = require('mysql')

module.exports = mySqlConnection = mysql.createConnection({
	host: 'us-cdbr-east-04.cleardb.com',
	user: 'bd2e0d27b93aad',
	password: '8547866a',
	database: 'heroku_36eed05c4d3c685'

    
})

mySqlConnection.connect((err) => {
    if(!err){
        console.log( "Database Connected" );
    }
    else{
        console.log( err.message );
    }
})
