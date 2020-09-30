const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {
    // console.log('desde crearUsuario');
    // console.log(req.body);

    // REVISAR SI HAY ERRORES
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })

    }

    // EXTRAER EMAIL Y PASSWORD
    const { email, password } = req.body;

    try {
        // REVISAR QUE EL USUARIO REGISTRADO SEA ÚNICO        
        let usuario = await Usuario.findOne({ email });

        if(usuario){
           return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        // CREA el nuevo usuario
        usuario = new Usuario(req.body);

        // HASHEAR el Password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt );

        // GUARDAR usuario
        await usuario.save();

        // CREAR Y FIRMAR EL JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };
        // FIRMAR EL JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // 1 hora
        }, (error, token) => {
            if (error) throw error;                
            
            // Mensaje de confirmación
            res.json({ token: token });  
        });

        // Mensaje de confirmación
        // res.json({ msg: 'Usuario creado correctamente' });

    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}