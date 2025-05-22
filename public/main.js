fetch('/api/usuarios')
  .then(res => res.json())
  .then(data => {
    console.log('Usuarios:', data);
    // Aquí puedes renderizar en HTML
  })
  .catch(err => console.error('Error:', err));
