const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });


const conectaDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify:false
        });

        console.log("DB CONECTADA...");
        
    } catch (error) {
        console.log(error);
        process.exit(1); // DETENER LA APP        
    }
}

module.exports = conectaDB;