const db = require('../db')

const adminGET = function (req, res) {

    if (req.session.logged) { // Chequeará si es true de cuando hicimos el login
        let sql = "SELECT * FROM productos"
        db.query(sql, function (err, data) {
            if (err) res.send(`Ocurrió un error ${err.code}`);

            res.render('admin', {
                titulo: "Panel de control",
                productos: data
            })

        })

    } else {
        res.render('login', {
            titulo: "Login",
            error: "Nombre de usuario o contraseña incorrecto(s)"
        })
    }





}

const agregarProductoGET = function (req, res) {
    res.render('agregar-producto')
}

const agregarProductoPOST = function (req, res) {
    let detalleProducto = req.body // Tomará un objeto con la info del formulario

    // consulta de base de datos
    let sql = "INSERT INTO productos SET ?"
    db.query(sql, detalleProducto, function (err, data) {
        if (err) res.send(`Ocurrió un error ${err.code}`);
        console.log("Producto agregado")
    })
    res.render('agregar-producto', {
        mensaje: "Producto agregado correctamente",
        titulo: 'Agregar producto'
    })
}

const editarProducto_ID = function (req, res) {

    let id = req.params.id
    let sql = "SELECT * FROM productos WHERE id = ?"
    db.query(sql, id, function (err, data) {
        if (err) res.send(`Ocurrió un error ${err.code}`);

        if (data == "") {
            res.send(`
                <h1>no existe producto con id ${id}</h1>
                <a href="./admin/">Ver listado de productos</a>    
            `)
        } else {
            res.render('editar-producto', {
                titulo: "Editar producto",
                producto: data[0]
            })
        }
    })


}

const editarProductoPOST_ID = function (req, res) {
    let id = req.params.id // parámetro ID de la url
    let detalleProducto = req.body  // datos del formulario

    let sql = "UPDATE productos SET ? WHERE id = ?" // comando SQL para actualizar un registro

    db.query(sql, [detalleProducto, id], function (err, data) {
        if (err) res.send(`Ocurrió un error ${err.code}`);
        console.log(data.affectedRows + " registro actualizado");
    })

    res.redirect('/admin');
}

const borrarProducto_ID = function (req, res) {

    let id = req.params.id

    let sql = "DELETE FROM productos WHERE id = ?"
    db.query(sql, id, function (err, data) {
        if (err) res.send(`Ocurrió un error ${err.code}`);
        console.log(data.affectedRows + " registro borrado");
    })

    res.redirect('/admin');

}

const loginGET = function (req, res) {
    res.render('login')
}

const loginPOST = function (req, res) {

    let usuario = req.body.username
    let clave = req.body.password

    if (usuario && clave) { // Chequea que NO esté vacio, es decir, si son true ambos.
        let sql = 'SELECT * FROM cuentas WHERE usuario = ? AND clave = ?'
        db.query(sql, [usuario, clave], function (err, data) {
            console.log("LONGITUD DATA", data.length)
            if (data.length > 0) {
                req.session.logged = true; // Creamos una propiedad llamada "logged" para que el objeto session almacene el valor "TRUE"
                req.session.nombreUsuario = usuario
                res.redirect('/admin')
            } else {
                res.render('login', {
                    titulo: "Login",
                    error: "Nombre de usuario o contraseña incorrecto(s)"
                })
            }
        })
    } else {
        res.render("login", { titulo: "Login", error: "Por favor escribe un nombre de usuario y contraseña" })
    }


}

module.exports = {
    adminGET,
    agregarProductoGET,
    loginGET,
    loginPOST,
    agregarProductoPOST,
    editarProducto_ID,
    borrarProducto_ID,
    editarProductoPOST_ID
}