// RUTAS PARA AUTENTICAR USUARIOS
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// INICIAR SESIÓN
// api/auth
// router.post('/', () => {
//     console.log('Creando usuario...');
// });
router.post('/', 
    // [       
    //     check('email', 'Agrega un email válido').isEmail(),
    //     check('password', 'El password debe ser mínimo  de 6 caracteres').isLength({ min: 6 })
    // ],
    authController.autenticarUsuario
);

// OBTIENE EL USUARIO AUTENTICADO
router.get('/', 
    auth,
    authController.usuarioAutenticado
);

module.exports = router;