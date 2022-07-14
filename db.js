let mysql      = require('mysql');
let connection = mysql.createConnection({
 /* host     : 'bqg0vqgdtw3fgq37gwoy-mysql.services.clever-cloud.com',
  user     : 'ufwqfm7hv2wkggxk',
  password : 'KeMjtk6AFAQ1TKAL5X98',
  database : 'bqg0vqgdtw3fgq37gwoy' */
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