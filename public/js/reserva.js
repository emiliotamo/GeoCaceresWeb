document.getElementById('formReserva').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    // ⚠️ Esto debe venir del usuario logueado (provisionalmente usamos 1)
    const usuario_id = 1;
  
    const servicio_id = document.getElementById('servicio_id').value;
    const fecha = document.getElementById('fecha').value;
    const cantidad = document.getElementById('cantidad').value;
  
    try {
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id, servicio_id, fecha, cantidad })
      });
  
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error('❌ Error al enviar la reserva:', err);
      alert('Ocurrió un error al hacer la reserva.');
    }
  });
  