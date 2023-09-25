import express from 'express';
import dotenv from 'dotenv';
import { con } from './db/Atlas.js';
import cors from 'cors'; // Importa el middleware CORS

dotenv.config();

const app = express();
const config = JSON.parse(process.env.VITE_My_server);
export default config;

(async () => {
  const db = await con();
  const usuarios = db.collection('user');

  app.use(express.json());

  // Habilita CORS
  app.use(cors());

  app.get("/api/obtenerUltimoUserId", async (req, res) => {
    try {
      // Buscar el último User_id registrado en la base de datos
      const lastUser = await usuarios.findOne({}, { sort: { User_id: -1 } });
      
      // Si no se encuentra ningún usuario, responder con 0 como último User_id
      if (!lastUser) {
        return res.status(200).json({ lastUserId: 0 });
      }
  
      // Responder con el último User_id encontrado
      res.status(200).json({ lastUserId: lastUser.User_id });
    } catch (error) {
      // Manejar errores, si los hay
      console.error("Error al obtener el último User_id:", error);
      res.status(500).json({ message: "Error al obtener el último User_id" });
    }
  });
  //para registrar usuario
  app.post('/api/registrar', async (req, res) => {
    try {
      const {  User_id,User_name, Password, Email, Phone, Address, Role  } = req.body;
      
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
  //para verificar correo ya registrado
  app.post('/api/verificarEmail', async (req, res) => {
    try {
      const { Email } = req.body;
  
      // Buscar el correo electrónico en la base de datos
      const existingUser = await usuarios.findOne({ Email });
  
      if (existingUser) {
      
        // console.log(WhatsRole)
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
  //verificarEmailYcontraseña antes del ingreso
  app.post('/api/verificarEmailyContras', async (req, res) => {
    try {
      const { Email, Password } = req.body;
  
      // Buscar el usuario por correo electrónico en la base de datos
      const existingUser = await usuarios.findOne({ Email });
  
      if (existingUser) {
        if (existingUser.Password === Password) {
          let userType;
          if (existingUser.Role === 'administrador') {
            userType = 'administrador';
          } else if (existingUser.Role === 'trabajador') {
            userType = 'trabajador';
          } else {
            userType = 'usuario';
          }
  
          // Enviar el tipo de usuario en la respuesta JSON
          res.status(200).json({ userType });
        } else {
          res.status(401).json({ message: 'Correo o Contraseña incorrecta' });
        }
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      // Manejar errores, si los hay
      console.error('Error al verificar correo electrónico y contraseña:', error);
      res.status(500).json({ message: 'Error al verificar correo electrónico y contraseña' });
    }
  });
  
  app.get("/api/obtenerUsuarioPorEmail", async (req, res) => {
    try {
      const { Email } = req.query; // Obtén el correo electrónico desde la consulta
  
      // Busca el usuario en la colección 'user' por correo electrónico
      const user = await usuarios.findOne({ Email: Email });
  
      if (user) {
        // Si se encuentra el usuario, responde con los datos del usuario
        res.status(200).json(user);
      } else {
        // Si no se encuentra el usuario, responde con un mensaje de error
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      // Maneja los errores, si los hay
      console.error("Error al obtener el usuario por correo electrónico:", error);
      res.status(500).json({ message: "Error al obtener el usuario por correo electrónico" });
    }
  });

  app.listen(config.port, config.hostname, () => {

    console.log(`Servidor iniciado en http://${config.hostname}:${config.port}`);
  });
})();
