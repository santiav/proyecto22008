const express = require('express')
const app = express()
require('./helpers/helper');
const path = require('path');



// Middlewares
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static('public'));



// plantilla HBS
const hbs = require('hbs');
app.set('view engine', 'hbs');
app.set('views', [
  path.join('./views/front'), // adjuntar carpeta a "views"
  path.join('./views/back'),
  path.join('./views')
])
hbs.registerPartials(__dirname + '/views/partials');


// rutas
app.use('/', require('./routes/rutas'))

// 404
app.use(function(req, res, next) {
  res.status(404).render('404');
});

app.listen(3000, function() {
    console.log("Servidor ONLINE en puerto 3000")
})