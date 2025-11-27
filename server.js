
// bash -> node server.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); // Permitir peticiones desde cualquier origen

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Cambia si es distinto
    password: 'root123',    // Tu contraseña
    database: 'movies_db'
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL');
});

// Endpoint para obtener películas
app.get('/', (req, res) => {
    const query = 'SELECT id, titulo, genero, anio_creacion, portada, detalle, director, duracion_min FROM movies';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

