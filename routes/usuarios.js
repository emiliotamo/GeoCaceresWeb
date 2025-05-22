const express = require('express');
const router = express.Router();
const db = require('../db/client');
const bcrypt = require('bcrypt');

// GET: Obtener todos los usuarios (solo para pruebas)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener usuarios', err);
    res.status(500).send('Error del servidor');
  }
});

// POST: Registro de nuevo usuario
router.post('/register', async (req, res) => {
  const { name, username, email, phone, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO usuarios (name, username, email, phone, password) VALUES ($1, $2, $3, $4, $5)',
      [name, username, email, phone, hashedPassword]
    );

    res.json({ message: '✅ Usuario registrado correctamente' });
  } catch (err) {
    console.error('❌ Error al registrar usuario:', err);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// POST: Inicio de sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM usuarios WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Login correcto
    res.json({
      message: 'Inicio de sesión correcto',
      user_id: user.id,
      username: user.username,
      name: user.name
    });
  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
