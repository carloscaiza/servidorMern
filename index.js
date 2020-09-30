// console.log("Desde el archivo index.js");
const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors'); 

// CREAR EL SERVIDOR (app - servidor)
const app = express();

// CONECTAR A LA BASE DE DATOS
conectarDB();

// HABILITAR CORS -> PERMITIR INTERCAMBIAR INFORMACIÓN DESDE EL FRONTEND
app.use(cors());

// HABILITAR EXPRESS.JSON -> LEER DATOS QUE EL USUARIO COLOQUE | SIMILAR A BODY PARSE
app.use(express.json({ extended: true })); // COLOCAR EN EL HEADER Content-Type: application/json

// PUERTO DE LA app o servidor
const PORT = process.env.PORT || 4000;

// IMPORTAR RUTAS
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

// DEFINIR LA PÁGINA PRINCIPAL
// app.get('/', (req, res) => {
//     res.send('HOLA MUNDO')
// });

// ARRANCAR  LA app
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
})
