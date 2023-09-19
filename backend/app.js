import express from 'express';
import dotenv from 'dotenv';
import { con } from './db/atlas.js';
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
      
      // Asegúrate de que User_id sea un número entero
      const parsedUser_id = parseInt(User_id);
      if (isNaN(parsedUser_id)) {
        throw new Error('User_id debe ser un número entero');
      }

      const userData = {
        User_id: parsedUser_id, // User_id debe ser un número entero
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

  app.listen(config.port, config.hostname, () => {
    console.log(`Servidor iniciado en http://${config.hostname}:${config.port}`);
  });
})();
