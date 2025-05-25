const express = require('express');
const router = express.Router();
const db = require('../db/client');

// Crear una reserva con límite de 6 por día y servicio
router.post('/', async (req, res) => {
  const { usuario_id, servicio_id, fecha, cantidad = 1 } = req.body;

  try {
    // Comprobar cuántas reservas ya hay para ese día y servicio
    const result = await db.query(
      'SELECT COUNT(*) FROM reservas WHERE servicio_id = $1 AND fecha = $2',
      [servicio_id, fecha]
    );

    const yaReservadas = parseInt(result.rows[0].count);

    if (yaReservadas + cantidad > 6) {
      return res.status(400).json({
        message: '❌ No quedan plazas disponibles para ese servicio en esa fecha.'
      });
    }

    // Crear la reserva
    await db.query(
      'INSERT INTO reservas (usuario_id, servicio_id, fecha, cantidad) VALUES ($1, $2, $3, $4)',
      [usuario_id, servicio_id, fecha, cantidad]
    );

    res.json({ message: '✅ Reserva realizada con éxito' });
  } catch (err) {
    console.error('❌ Error al crear reserva:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
