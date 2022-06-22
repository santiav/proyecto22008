const express = require('express')
const app = express()
const datos = require('./productos.json')

// plantilla
const hbs = require('hbs');
app.set('view engine', 'hbs');

app.get('/', function (req, res) {
  res.render('index', {
    productos: datos[0].data
  })
})

app.get('/contacto', function(req, res) {
  res.render('contacto')
})

app.listen(3000, function() {
    console.log("Servidor ONLINE en puerto 3000")
})