const express = require('express')
const app = express()
const datos = require('./productos.json')
require('./helpers/helper');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

// para recibir emails 
let nodemailer = require('nodemailer');

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

app.post('/contacto', function(req, res) {
  // Definimos el transporter
  let transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "683bb9e3393240",
      pass: "99a59f1999facb"
    }
  })
  // Definimos el e-mail
  console.log("BODY: ", req.body)
  let data = req.body
  let mailOptions = {
    from: data.nombre, // de: "Santi"
    to: "santiago.acosta@bue.edu.ar",
    subject: data.asunto,
    html: `<p> ${data.mensaje}</p>`
  }
  // enviar email
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error)
      res.status(500, error.message)
      res.status(500).render('contacto', {
        mensaje: `Ha ocurrido el siguiente error ${error.message}`,
        mostrar: true,
        clase: 'danger'
      })
    } else {
      console.log('E-mail enviado')
      res.status(200).render('contacto', {
        mensaje: "Mail enviado correctamente",
        mostrar: true,
        clase: 'success'
      })
    }
  })
})

app.listen(3000, function() {
    console.log("Servidor ONLINE en puerto 3000")
})