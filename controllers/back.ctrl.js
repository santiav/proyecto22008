const db = require('../db')

const adminGET = function (req, res) {
    
    let sql = "SELECT * FROM productos"
    db.query(sql, function(err, data) {
        if (err) res.send(`Ocurrió un error ${err.code}`);

        res.render('admin', {
            titulo: "Panel de control",
            productos: data
        })

    })


}

const agregarProductoGET = function (req, res) {
    res.render('agregar-producto')
}

const agregarProductoPOST = function (req, res) {
    let detalleProducto = req.body // Tomará un objeto con la info del formulario

    // consulta de base de datos
    let sql = "INSERT INTO productos SET ?"
    db.query(sql, detalleProducto, function(err, data) {
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
    db.query(sql, id, function(err, data) {
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

const editarProductoPOST_ID = function(req, res) {
    let id = req.params.id // parámetro ID de la url
    let detalleProducto = req.body  // datos del formulario

    let sql = "UPDATE productos SET ? WHERE id = ?" // comando SQL para actualizar un registro

    db.query(sql, [detalleProducto, id], function(err, data) {
        if (err) res.send(`Ocurrió un error ${err.code}`);
        console.log(data.affectedRows + " registro actualizado");
    })

    res.redirect('/admin');
}

const borrarProducto_ID = function (req, res) {

    let id = req.params.id

    let sql = "DELETE FROM productos WHERE id = ?"
    db.query(sql, id, function(err, data) {
        if (err) res.send(`Ocurrió un error ${err.code}`);
        console.log(data.affectedRows + " registro borrado");
    })

    res.redirect('/admin');
    
}

const loginGET = function (req, res) {
    res.render('login')
}

module.exports = {
    adminGET,
    agregarProductoGET,
    loginGET,
    agregarProductoPOST,
    editarProducto_ID,
    borrarProducto_ID,
    editarProductoPOST_ID
}