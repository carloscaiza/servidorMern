const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearProyecto = async (req, res) => {

    // REVISAR SI HAY ERRORES
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }    

    try {
        // CREAR UN NUEVO PROYECTO
        const proyecto = new Proyecto(req.body);

        // GUARDAR EL CREADOR VÍA JWT
        proyecto.creador = req.usuario.id;

        // GUARDAMOS EL PROYECTO
        proyecto.save();
        res.json(proyecto);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

// OBTIENE TODOS LOS PROYECTOS DEL USUARIO ACTUAL
exports.obtenerProyectos = async (req, res) => {

    try {        
        // console.log(req.usuario); // MUESTRA EL USUARIO
        // const proyectos = await Proyecto.find({ creador: req.usuario.id });
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
        res.json({ proyectos });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// ACTUALIZA UN PROYECTO
exports.actualizarProyecto = async (req, res) => {

    // REVISAR SI HAY ERRORES
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }  

    // EXTRAER LA INFORMACIÓN DEL PROYECTO
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        // REVISAR EL ID
        // console.log(req.params.id);
        let proyecto = await Proyecto.findById(req.params.id);

        // SI EL PROYECTO EXISTE O NO
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no Encontrado'});
        }

        // VERIFICAR EL CREADOR DEL PROYECTO
        if (proyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // ACTUALIZAR
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto}, { new: true });

        res.json({ proyecto });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }

}

// ELIMINA UN PROYECTO POR SU ID
exports.eliminarProyecto = async (req, res) => {

    try {
        // REVISAR EL ID
        // console.log(req.params.id);
        let proyecto = await Proyecto.findById(req.params.id);

        // SI EL PROYECTO EXISTE O NO
        if (!proyecto) {
            return res.status(404).json({ msg: 'Proyecto no Encontrado'});
        }

        // VERIFICAR EL CREADOR DEL PROYECTO
        if (proyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // ELIMINAR EL PROYECTO
        await Proyecto.findOneAndRemove({ _id: req.params.id});
        res.json({ msg: 'Proyecto eliminado '});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }

}