import express from 'express';
import dotenv from 'dotenv';
import { con } from './db/Atlas.js';
import cors from 'cors'; // Importa el middleware CORS

dotenv.config();

const app = express();
const config = JSON.parse(process.env.My_server);

(async () => {
  const db = await con();
  const usuarios = db.collection('user');

  app.use(express.json());

  // Habilita CORS
  app.use(cors());

  app.post('/api/registrar', async (req, res) => {
    try {
      const { User_id, User_name, Password, Email, Phone, Address, Role } = req.body;
      
      const userData = {
        User_id, 
        User_name,
        Password,
        Email,
        Phone,
        Address,
        Role,
      };
    
      await usuarios.insertOne(userData);

      // Enviar una respuesta de éxito
      res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
      // Manejar errores, si los hay
      console.error('Error al registrar usuario app.js:', error);
      res.status(500).json({ message: 'Error al registrar usuario app.js' });
    }
  });

  app.post('/api/verificarEmail', async (req, res) => {
    try {
      const { Email } = req.body;
  
      // Buscar el correo electrónico en la base de datos
      const existingUser = await usuarios.findOne({ Email });
  
      if (existingUser) {
        // El correo electrónico ya está registrado
        res.status(200).json({ message: 'Correo electrónico ya registrado' });
      } else {
        // El correo electrónico no está registrado
        res.status(404).json({ message: 'Correo electrónico no registrado' });
      }
    } catch (error) {
      // Manejar errores, si los hay
      console.error('Error al verificar correo electrónico app.js:', error);
      res.status(500).json({ message: 'Error al verificar correo electrónico app.js' });
    }
  });
  

  app.listen(config.port, config.hostname, () => {
    console.log(`Servidor iniciado en http://${config.hostname}:${config.port}`);
  });
})();
