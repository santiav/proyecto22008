require('dotenv').config()
const datos = require('../productos.json')
// para recibir emails 
let nodemailer = require('nodemailer');


// INICIO:GET 
const inicioGET = function (req, res) {
    res.render('index', {
        productos: datos[0].data
    })
}

const contactoGET = function (req, res) {
    res.render('contacto')
}

const contactoPOST = function (req, res) {
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
    transporter.sendMail(mailOptions, function (error, info) {
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
}

const comoComprarGET = function (req, res) {
    res.render('como-comprar')
}

const detalleProductoGET = function (req, res) {
    res.render('detalle-producto')
}

const sobreNosotrosGET = function (req, res) {
    res.render('sobre-nosotros')
}

module.exports = {
    inicioGET,
    contactoGET,
    contactoPOST,
    comoComprarGET,
    detalleProductoGET,
    sobreNosotrosGET
}