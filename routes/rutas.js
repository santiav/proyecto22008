const { Router } = require('express')
const router = Router()

const {
    inicioGET,
    contactoGET,
    contactoPOST,
    comoComprarGET,
    detalleProductoGET,
    sobreNosotrosGET
} = require('../controllers/front.ctrl')
console.log("controlador", inicioGET)

// Rutas FRONT
router.get('/', inicioGET)
router.get('/contacto', contactoGET)
router.post('/contacto', contactoPOST)
router.get('/como-comprar', comoComprarGET)
router.get('/detalle-producto', detalleProductoGET)
router.get('/sobre-nosotros', sobreNosotrosGET)

// rutas BACK

const {
    adminGET,
    agregarProductoGET,
    editarProductoGET,
    loginGET
} = require('../controllers/back.ctrl')

router.get('/admin', adminGET)

router.get('/agregar-producto', agregarProductoGET)

router.get('/editar-producto', editarProductoGET)

router.get('/login', loginGET)

module.exports = router