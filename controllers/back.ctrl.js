const db = require('../db')
const fs = require('fs');
const { upload, maxSizeMB, multer } = require('../helpers/helper')



const adminGET = function (req, res) {

    if (req.session.logueado) { // Chequeará si es true de cuando hicimos el login
        let sql = "SELECT * FROM productos"
        db.query(sql, function (err, data) {
            if (err) throw err;

            console.log("usuario", req.session)
            res.render('admin', {
                titulo: "Panel de control",
                logueado: true,
                usuario: req.session.nombreUsuario,
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
    if (req.session.logueado) {
        res.render('agregar-producto', {
            titulo: "Agregar producto",
            logueado: true,
            usuario: req.session.nombreUsuario
        })
    } else {
        res.render('login', {
            titulo: "Login",
            error: "Por favor loguearse para ver ésta página"
        })
    }

}

const agregarProductoPOST = function (req, res) {

    upload(req, res, function (err) {
        // Manejo de ERRORES de multer
        if (err instanceof multer.MulterError) {
            // Error de Multer al subir imagen
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).render('agregar-producto', { mensaje: `Imagen muy grande, por favor ahicar a ${maxSizeMB}`, clase: danger });
            }
            return res.status(400).render('agregar-producto', { mensaje: err.code, clase: danger });
        } else if (err) {
            // Ocurrió un error desconocido al subir la imagen
            return res.status(400).render('agregar-producto', { mensaje: err, clase: danger });
        }

        // SI TODO OK
        const detalleProducto = req.body; // Solo toma los TEXTOS
        console.log("FILE --->", req.file)

        const nombreImagen = req.file.filename; // Tomo el nombre del archivo de la imagen
        detalleProducto.rutaImagen = nombreImagen //{ rutaImagen: "Lenovo X200" DEBE coincidir con el nombre de la columna de la tabla}
        console.log("DETALLE DEL PRODUCTO  --> ", detalleProducto)

        // consulta de base de datos
        let sql = "INSERT INTO productos SET ?"
        db.query(sql, detalleProducto, function (err, data) {
            if (err) throw err;
            console.log("Producto agregado")
        })
        res.render('agregar-producto', {
            mensaje: "Producto agregado correctamente",
            clase: "success",
            titulo: 'Agregar producto'
        })


    })

}

const editarProducto_ID = function (req, res) {

    if (req.session.logueado) {
        let id = req.params.id
        let sql = "SELECT * FROM productos WHERE id = ?"
        db.query(sql, id, function (err, data) {
            if (err) throw err;

            if (data == "") {
                res.send(`
                <h1>no existe producto con id ${id}</h1>
                <a href="./admin/">Ver listado de productos</a>    
            `)
            } else {
                res.render('editar-producto', {
                    titulo: "Editar producto",
                    logueado: true,
                    usuario: req.session.nombreUsuario,
                    producto: data[0]
                })
            }
        })
    } else {
        res.render('login', {
            titulo: "Login",
            error: "Por favor loguearse para ver ésta página"
        })
    }




}

const editarProductoPOST_ID = function (req, res) {


    upload(req, res, function (err) {
        // Manejo de ERRORES de multer
        if (err instanceof multer.MulterError) {
            // Error de Multer al subir imagen
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).render('agregar-producto', { mensaje: `Imagen muy grande, por favor ahicar a ${maxSizeMB}`, clase: danger });
            }
            return res.status(400).render('agregar-producto', { mensaje: err.code, clase: danger });
        } else if (err) {
            // Ocurrió un error desconocido al subir la imagen
            return res.status(400).render('agregar-producto', { mensaje: err, clase: danger });
        }

        let id = req.params.id // parámetro ID de la url
        let detalleProducto = req.body  // datos del formulario

        // chequear si la edición incluyó cambio de imagen
        if (req.hasOwnProperty("file")) { // Si se subió una imagen entonces multer adjuntó la propiedad "file"
            console.log("EDITAR: req.FILE -->", req.file)
            const nombreImagen = req.file.filename;
            detalleProducto.rutaImagen = nombreImagen

            // 
            let borrarImagen = 'SELECT rutaImagen FROM productos WHERE id = ?';
            db.query(borrarImagen, id, function (err, data) {
                if (err) throw err

                console.log("Imagen a borrar", data[0].rutaImagen)
                fs.unlink(`./public/uploads/${data[0].rutaImagen}`, function (err) {
                    if (err) throw err


                    // Una vez borrada la imagen se procede a actualizar el registro en la DB
                    let sql = "UPDATE productos SET ? WHERE id= ?"
                    db.query(sql, [detalleProducto, id], function (err, data) {
                        if (err) throw err;
                        console.log(data.affectedRows + " registro(s) actualizado(s)");
                    });
                })
            })
        }

        let sql = "UPDATE productos SET ? WHERE id = ?"
        db.query(sql, [detalleProducto, id], function (err, data) {
            if (err) throw err;
            console.log(data.affectedRows + " registro actualizado");
        })

        res.redirect("/admin")

    })



    // ------



}

const borrarProducto_ID = function (req, res) {


    if (req.session.logueado) {
        let id = req.params.id

        // Borrar imagen
        let borrarImagen = 'SELECT rutaImagen FROM productos WHERE id = ?';
        db.query(borrarImagen, [id], function (err, data) {
            console.log(data[0].rutaImagen)
            if (err) throw err

            fs.unlink(`public/uploads/${data[0].rutaImagen}`, (err) => {
                if (err) throw err;
                console.log('Archivo borrado');
            });
        });

        // Borrar desde la base de datos
        let sql = "DELETE FROM productos WHERE id = ?"
        db.query(sql, id, function (err, data) {
            if (err) throw err;
            console.log(data.affectedRows + " registro borrado");
        })

        res.redirect('/admin');
    }
    else {
        res.render("login", { titulo: "Login", error: "Por favor loguearse para ver ésta página" })
    }

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
                req.session.logueado = true; // Creamos una propiedad llamada "logueado" para que el objeto session almacene el valor "TRUE", es para usarlo en el parcial de "header"
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

const logout = function (req, res) {

    req.session.destroy(function (err) {
        console.log(`Error en el logout ${err}`)
    })

    // Al finalizar sesión vuelve al inicio
    let sql = 'SELECT * FROM productos';
    db.query(sql, function (err, data) {
        if (err) throw err;

        res.render('index', {
            titulo: "Mi emprendimiento",
            data
        })
    });

}

module.exports = {
    adminGET,
    agregarProductoGET,
    loginGET,
    loginPOST,
    agregarProductoPOST,
    editarProducto_ID,
    borrarProducto_ID,
    editarProductoPOST_ID,
    logout
}