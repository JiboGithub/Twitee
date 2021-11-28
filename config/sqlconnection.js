const mysql = require('mysql')

module.exports = mySqlConnection = mysql.createConnection({
	host: 'us-cdbr-east-04.cleardb.com',
	user: 'be4c0bd34d1cf5',
	password: '313db43b',
	database: 'heroku_d3562f421d86026',
	port: 3036

    
})

mySqlConnection.connect((err) => {
    if(!err){
        console.log( "Database Connected" );
    }
    else{
        console.log( err.message );
    }
})
