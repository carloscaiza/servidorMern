const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// CREA UNA NUEVA TAREA
exports.crearTarea = async (req, res) => {

    // REVISAR SI HAY ERRORES
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() })
    }    

    try {
        // EXTRAER EL PROYECTO Y COMPROBAR SI EXISTE
        const { proyecto } = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // REVISAR SI EL PROYECTO ACTUAL PERTENECE AL USUARIO AUTENTICADO
        if (existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // CREAR LA TAREA
        const tarea = new Tarea(req.body);        

        // GUARDAMOS EL PROYECTO
        await tarea.save();
        res.json(tarea);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

// OBTIENE LAS TAREAS POR PROYECTO
exports.obtenerTareas = async (req, res) => {

    try {
        // EXTRAER EL PROYECTO Y COMPROBAR SI EXISTE
        // const { proyecto } = req.body;
        const { proyecto } = req.query;

        // console.log(req.body);
        // console.log(req.query);

        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // REVISAR SI EL PROYECTO ACTUAL PERTENECE AL USUARIO AUTENTICADO
        if (existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado' });
        }

        // OBTENER LAS TAREAS POR PROYECTO
        // const tareas = await Tarea.find({ proyecto });
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
        res.json({ tareas });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// ACTUALIZAR UNA TAREA
exports.actualizarTarea = async (req, res) => {

    try {
        // EXTRAER EL PROYECTO Y COMPROBAR SI EXISTE
        const { proyecto, nombre, estado } = req.body;

        // SI LA TAREA EXISTE O NO
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return res.status(404).json({ msg: 'No existe esa tarea' });
        }

        // EXTRAER PROYECTO
        const existeProyecto = await Proyecto.findById(proyecto);        

        // REVISAR SI EL PROYECTO ACTUAL PERTENECE AL USUARIO AUTENTICADO
        if (existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado' });
        }
        
        // CREAR UN OBJETO CON LA NUEVA INFORMACIÓN
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;        
        nuevaTarea.estado = estado;                            

        // GUARDAR LA TAREA
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });
        res.json({ tarea });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// ELIMINA UNA TAREA
exports.eliminarTarea = async (req, res) => {
    try {
        // EXTRAER EL PROYECTO Y COMPROBAR SI EXISTE
        // const { proyecto } = req.body;
        const { proyecto } = req.query;

        // SI LA TAREA EXISTE O NO
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return res.status(404).json({ msg: 'No existe esa tarea' });
        }

        // EXTRAER PROYECTO
        const existeProyecto = await Proyecto.findById(proyecto);        

        // REVISAR SI EL PROYECTO ACTUAL PERTENECE AL USUARIO AUTENTICADO
        if (existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado' });
        }
        
        // Eliminar
        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Tarea Eliminada' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
