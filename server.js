const express = require('express')
const session = require('express-session')
let MySQLStore = require('express-mysql-session')(session);
const path = require('path');
const app = express()
require('./helpers/helper');

let opciones = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'prueba_sesiones'
}

let almacenamientoSesiones = new MySQLStore(opciones)


app.use(session({
    key: 'proyecto22008',
    secret: "sarasa",
    store: almacenamientoSesiones,
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge: 300000} // 5 minutos

}))


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