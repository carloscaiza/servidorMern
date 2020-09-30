// RUTAS PARA CRUD TAREAS
const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// CREA TAREAS
// /api/tareas
router.post('/', 
    auth,
    [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty(),        
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty(),        
    ],    
    tareaController.crearTarea
);

// OBTENER LAS TAREAS POR PROYECTO
router.get('/', 
    auth,
    tareaController.obtenerTareas
);

// ACTUALIZAR TAREA VÍA ID
router.put('/:id', 
    auth,
    [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty(),        
    ], 
    tareaController.actualizarTarea
);

// ELIMINAR TAREA
router.delete('/:id', 
    auth,    
    tareaController.eliminarTarea
);


module.exports = router;