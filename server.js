const express = require('express')
const app = express()
const datos = require('./productos.json')

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
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
  })
  // Definimos el e-mail
  console.log("BODY: ", req.body)
  let data = req.body
  let mailOptions = {
    from: data.nombre, // de: "Santi"
    to: process.env.EMAIL_PRIMARIO,
    subject: data.asunto,
    text: data.mensaje
  }
  // enviar email
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error)
      res.status(500, error.message)
      res.status(500).render('contacto', {
        mensaje: `Ha ocurrido el siguiente error ${error.message}`,
        mostrar: true
      })
    } else {
      console.log('E-mail enviado')
      res.status(200).render('contacto', {
        mensajeOk: "Mail enviado correctamente",
        mostrar: false
      })
    }
  })
})

app.listen(3000, function() {
    console.log("Servidor ONLINE en puerto 3000")
})