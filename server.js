require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 💾 Conexión a base de datos (Render)
const db = require('./db/client');

// 🔌 Rutas externas (usuarios)
const usuariosRoutes = require('./routes/usuarios');

// Validación de la API Key
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Falta la variable de entorno OPENAI_API_KEY.");
  process.exit(1);
}

// ----- API Proxy -----
class ApiService {
  constructor(apiKey) {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:5010/api/OpenDataSig',
      headers: {
        'Content-Type': 'application/json',
        'OpenAi-ApiKey': apiKey,
      },
    });
  }

  async sendMessage(payload) {
    const url = payload.threadId
      ? `/sendMessage?threadId=${encodeURIComponent(payload.threadId)}`
      : '/sendMessage';

    try {
      const response = await this.axiosInstance.post(url, payload);
      return response.data;
    } catch (error) {
      console.error("❌ Error en ApiService:", error.response?.data || error.message);
      throw error;
    }
  }
}

const apiService = new ApiService(process.env.OPENAI_API_KEY);

// ----- Archivos estáticos -----
app.use(express.static(path.join(__dirname, 'public')));

// Página principal (GeoCaceres)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Página del asistente (asistente.html)
app.get('/asistente', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'asistente', 'asistente.html'));
});

// ----- API del asistente -----
app.post('/api/sendMessage', async (req, res) => {
  try {
    const { message, threadId } = req.body;

    if (!message) {
      return res.status(400).json({ assistant: "Debes enviar un mensaje válido." });
    }

    const payload = {
      message,
      threadId,
      coordinates: [0],
    };

    const apiResponse = await apiService.sendMessage(payload);
    const assistantText = apiResponse?.mensaje || "Lo siento, no tengo una respuesta en este momento.";
    const newThreadId = apiResponse.threadId || threadId;

    res.json({ assistant: assistantText, threadId: newThreadId });
  } catch (error) {
    console.error("❌ Error en /api/sendMessage:", error);
    res.status(500).json({ assistant: 'Error interno del servidor' });
  }
});

// 🔄 Rutas de la base de datos
app.use('/api/usuarios', usuariosRoutes);
const reservasRoutes = require('./routes/reservas');
app.use('/api/reservas', reservasRoutes);


// ----- Iniciar servidor -----
const port = 3000;
app.listen(port, () => {
  console.log(`🚀 Servidor funcionando: http://localhost:${port}`);
});
