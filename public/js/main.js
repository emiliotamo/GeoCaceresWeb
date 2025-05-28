document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM cargado");
  
    // Verifica usuario en localStorage
    const userData = localStorage.getItem("usuario");
    console.log("🧪 Usuario guardado:", userData);
  
    if (userData) {
      const user = JSON.parse(userData);
  
      // Actualizar el header
      const authContent = document.getElementById("authContent");
      console.log("🔎 authContent:", authContent);
      if (authContent) {
        authContent.innerHTML = `
          <strong>${user.username}</strong> /
          <a href="#" onclick="logoutUser()">Cerrar sesión</a>
        `;
      }
  
      // Ocultar campos del formulario de contacto
      const nameField = document.getElementById('contact-name');
      const emailField = document.getElementById('contact-email');
      if (nameField) nameField.style.display = 'none';
      if (emailField) emailField.style.display = 'none';
    }
  
    // Botón hamburguesa
    const ham = document.querySelector('.ham-menu');
    const nav = document.querySelector('.navbar');
    if (ham && nav) {
      ham.addEventListener("click", () => {
        ham.classList.toggle('active');
        nav.classList.toggle('active');
      });
    }
  
    // Loader
    const loadder = document.getElementById('preloadder');
    if (loadder) {
      window.addEventListener("load", () => {
        loadder.style.display = "none";
      });
    }
  
    // Estrellas de valoración
    document.querySelectorAll('.star').forEach(star => {
      star.addEventListener('click', function () {
        const value = parseInt(this.getAttribute('data-value'));
        document.querySelectorAll('.star').forEach(s => {
          s.innerHTML = s.getAttribute('data-value') <= value ? '★' : '☆';
        });
        console.log("⭐ Valoración dada:", value);
      });
    });
  
    // (Opcional) Fetch de usuarios
    fetch('/api/usuarios')
      .then(res => res.json())
      .then(data => {
        console.log('Usuarios:', data);
      })
      .catch(err => console.error('Error al obtener usuarios:', err));
  });
  