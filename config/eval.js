const { Client } = require('pg'); 
const client = new Client({ 
	user : 'kdg', 
	host : 'localhost',
	database : 'kdg', 
	password : '123',
	port : 5432, });

	client.connect();
	client.query('SELECT NOW()', (err, res) => { console.log(err, res) client.end() });

