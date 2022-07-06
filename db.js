let mysql      = require('mysql');
let connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'proyecto22008'
});

connection.connect(function(err) {
    if (err) throw err 
    console.log('La DB se ha conectado');
});


module.exports = connection