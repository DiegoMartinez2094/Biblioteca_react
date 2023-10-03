import express from 'express';
import dotenv from 'dotenv';
import { con } from './db/Atlas.js';
import * as cookie from 'cookie';
import cors from 'cors'; // Importa el middleware CORS

dotenv.config();

const app = express();
const config = JSON.parse(process.env.VITE_My_server);
export default config;

(async () => {
  const db = await con();
  const usuarios = db.collection('user');
  const devices = db.collection('device');
  const loans =db.collection('loan');

  app.use(express.json());

  // Habilita CORS
  app.use(cors());

  //------------------------------------------------------------------------------------------------------------------------------------

  //USUARIOS/

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
          // "User_id","User_name","Password","Email","Phone","Address","Role"

          // Crear una cookie 
          const userData = {
            User_id:existingUser.User_id,
            User_name: existingUser.User_name,
            userType: userType,
          };
  
          const cookieOptions = {
            httpOnly: true, // La cookie solo es accesible desde el servidor
            maxAge: 60,  // segundos 
          };
  
          // Establecer la cookie en la respuesta
          res.setHeader('Set-Cookie', cookie.serialize('tipo de usuario', JSON.stringify(userData), cookieOptions));
  
          // Enviar el tipo de usuario en la respuesta JSON
          res.status(200).json({   User_name: existingUser.User_name, User_id:existingUser.User_id,
            userType: userType,});
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

  app.delete("/api/eliminarUsuarioPorEmail", async (req, res) => {
    try {
      const { Email } = req.query; // Obtén el correo electrónico desde la consulta
  
      // Elimina el usuario de la colección 'usuarios' por correo electrónico
      const result = await usuarios.deleteOne({ Email: Email });
  
      if (result.deletedCount > 0) {
        // Si se eliminó el usuario, responde con un mensaje de éxito
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
      } else {
        // Si no se encontró el usuario, responde con un mensaje de error
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      // Maneja los errores, si los hay
      console.error("Error al eliminar el usuario por correo electrónico:", error);
      res.status(500).json({ message: "Error al eliminar el usuario por correo electrónico" });
    }
  });

  app.put("/api/editarUsuarioPorEmail", async (req, res) => {
    try {
      const { Email } = req.query; // Obtén el correo electrónico desde la consulta
      const { User_name, Password, Phone, Address, Role } = req.body; // Obtén los datos a actualizar desde el cuerpo de la solicitud
  
      // Edita el usuario de la colección 'usuarios' por correo electrónico
      const result = await usuarios.updateOne({ Email: Email }, {
        $set: {
          User_name,
          Password,
          Phone,
          Address,
          Role,
        },
      });
  
      if (result.modifiedCount > 0) {
        // Si se realizó una modificación en el usuario, responde con un mensaje de éxito
        res.status(200).json({ message: 'Usuario editado correctamente' });
      } else {
        // Si no se encontró el usuario, responde con un mensaje de error
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      // Maneja los errores, si los hay
      console.error("Error al editar el usuario por correo electrónico:", error);
      res.status(500).json({ message: "Error al editar el usuario por correo electrónico" });
    }
  });

  //---------------------------------------------------------------------------------------------------------------------------------

 //LIBROS//

 app.post('/api/registrarDevice', async (req, res) => {
  try {
    const {  Device_id,Device_name, Description_device, Device_category, Device_cost, Device_status, Device_comments  } = req.body;
    
    const DataBook = {
      Device_id: parseInt(Device_id),
      Device_name,
      Description_device,
      Device_category,
      Device_cost: parseInt(Device_cost),
      Device_status,
      Device_comments,
    };
  
    await devices.insertOne(DataBook);

    // Enviar una respuesta de éxito
    res.status(201).json({ message: 'Device registrado correctamente' });
  } catch (error) {
    // Manejar errores, si los hay
    console.error('Error al registrar Device app.js:', error);
    res.status(500).json({ message: 'Error al registrar Device app.js' });
  }
});

app.post('/api/verificarDevice_id', async (req, res) => {
  try {
    const { Device_id } = req.body;

    // Buscar el Id en la base de datos
    const existingDevice = await devices.findOne({ Device_id });

    if (existingDevice) {
      // El Dispositivo ya está registrado
      res.status(200).json(existingDevice);
    } else {
      // El Dispositivo no está registrado
      res.status(404).json({ message: 'dispositivo no registrado' });
    }
  } catch (error) {
    // Manejar errores, si los hay
    console.error('Error al verificar Dispositivo app.js:', error);
    res.status(500).json({ message: 'Error al verificar Dispositivo app.js' });
  }
});

app.get("/api/verificarDevice_id", async (req, res) => {
  try {
    const { Device_id } = req.query; // Usar req.query para obtener el parámetro de consulta

    // Convertir Device_id a número entero
    const Device_idInt = parseInt(Device_id);

    // Buscar el ID en la base de datos
    const existingDevice = await devices.findOne({ Device_id: Device_idInt });

    if (existingDevice) {
      // El Dispositivo ya está registrado
      res.status(200).json(existingDevice);
    } else {
      // El Dispositivo no está registrado
      res.status(404).json({ message: 'dispositivo no registrado' });
    }
  } catch (error) {
    // Manejar errores, si los hay
    console.error('Error al verificar Dispositivo app.js:', error);
    res.status(500).json({ message: 'Error al verificar Dispositivo app.js' });
  }
});

app.get("/api/obtenerLibroPorId", async (req, res) => {
  try {
    const { Device_id } = req.query; // Usar req.query para obtener el parámetro de consulta

    // Convertir Device_id a número entero
    const Device_idInt = parseInt(Device_id);

    const existingDevice = await devices.findOne({ Device_id: Device_idInt });
    if (existingDevice) {
      // Si se encuentra el libro, responde con los datos del libro
      res.status(200).json(existingDevice);
    } else {
      // Si no se encuentra el libro, responde con un mensaje de error
      res.status(404).json({ message: 'libro no encontrado' });
    }
  } catch (error) {
    // Maneja los errores, si los hay
    console.error("Error al obtener el libro por ID:", error);
    res.status(500).json({ message: "Error al obtener el libro" });
  }
});

app.delete("/api/eliminarDevicePorId", async (req, res) => {
  try {
    const { Device_id } = req.query; 
    const result = await devices.deleteOne({ Device_id: parseInt(Device_id) });

    if (result.deletedCount > 0) { 
      res.status(200).json({ message: 'dispositivo eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'dispositivo no encontrado' });
    }
  } catch (error) {
    
    console.error("Error al eliminar el dispositivo por ID:", error);
    res.status(500).json({ message: "Error al eliminar el dispositivo por ID" });
  }
});

app.put("/api/editarDevicePorId", async (req, res) => {
  try {
    const { New_Device_id } = req.body; // Nuevo valor para Device_id
    const {
      Device_name,
      Description_device,
      Device_category,
      Device_cost,
      Device_status,
      Device_comments,
    } = req.body;

    const result = await devices.updateOne(
      { Device_id: parseInt(New_Device_id) }, // Utilice el nuevo valor para buscar el dispositivo
      {
        $set: {
          Device_id: parseInt(New_Device_id), // Actualice el Device_id
          Device_name,
          Description_device,
          Device_category,
          Device_cost,
          Device_status,
          Device_comments,
        },
      }
    );

    if (result.modifiedCount > 0) {
      // Si se realizó una modificación en el dispositivo, responde con un mensaje de éxito
      res.status(200).json({ message: 'Dispositivo editado correctamente' });
    } else {
      // Si no se encontró el dispositivo, responde con un mensaje de error
      res.status(404).json({ message: 'Dispositivo no encontrado' });
    }
  } catch (error) {
    // Maneja los errores, si los hay
    console.error("Error al editar el Dispositivo:", error);
    res.status(500).json({ message: "Error al editar el Dispositivo" });
  }
});

app.get("/api/obtenerDevices", async (req, res) => {
  try {
    const device = await devices.find({}).toArray();
    if (device) {
      res.status(200).json(device);
    } else {
      console.log("No se encontraron dispositivos");
      res.status(200).json({ message: "No se encontraron dispositivos" });
    }
  } catch (error) {
    console.error("Error al obtener los dispositivos:", error);
    res.status(500).json({ message: "Error al obtener los dispositivos" });
  }
});

//--------------------------------------------------------------------------------------------------------------------------------
  //PRESTAMOS
  app.get("/api/obtenerUltimoLoaId", async (req, res) => {
    try {
      // Buscar el último Loan_ID registrado en la base de datos
      const lastLoan = await loans.findOne({}, { sort: { Loan_ID: -1 } });
      
      // Si no se encuentra ningún usuario, responder con 0 como último Loan_ID
      if (!lastLoan) {
        return res.status(200).json({ lastLoanId: 0 });
      }
      // Responder con el último Loan_ID encontrado
      res.status(200).json({ lastLoanId: lastLoan.Loan_ID });
    } catch (error) {
      // Manejar errores, si los hay
      console.error("Error al obtener el último Loan_ID:", error);
      res.status(500).json({ message: "Error al obtener el último Loan_ID" });
    }
  });
  
  app.post('/api/registrarLoan', async (req, res) => {
    try {
      const {   Loan_ID, User_ID, Device_id, Loan_Date, Expected_Return_Date, Loan_Status, Actual_Return_Date, Physical_Condition_Before, Physical_Condition_After, Loan_Comments   } = req.body;
      
      const DataLoan = {
        Loan_ID,
        User_ID,
        Device_id,
        Loan_Date,
        Expected_Return_Date,
        Loan_Status,
        Actual_Return_Date,
        Physical_Condition_Before,
        Physical_Condition_After,
        Loan_Comments
      };
    
      await loans.insertOne(DataLoan);
  
      // Enviar una respuesta de éxito
      res.status(201).json({ message: 'Prestamo registrado correctamente' });
    } catch (error) {
      // Manejar errores, si los hay
      console.error('Error al registrar el prestamo:', error);
      res.status(500).json({ message: 'Error al registrar prestamo' });
    }
  });

  app.post('/api/verificarLoan_ID', async (req, res) => {
    try {
      const { Loan_ID } = req.body;
      const existingLoan = await loans.findOne({ Loan_ID });
      if (existingLoan) {
        res.status(200).json(existingLoan);
      } else {
        res.status(404).json({ message: 'prestamo no registrado' });
      }
    } catch (error) {
      console.error('Error al verificar prestamo app.js:', error);
      res.status(500).json({ message: 'Error al verificar prestamo app.js' });
    }
  });

  app.delete("/api/eliminarLoanPorLoan_ID", async (req, res) => {
    try {
      const { Loan_ID } = req.query; 
      const result = await loans.deleteOne({ Loan_ID: parseInt(Loan_ID) });
      if (result.deletedCount > 0) { 
        res.status(200).json({ message: 'prestamo eliminado correctamente' });
      } else {
        res.status(404).json({ message: 'prestamo no encontrado' });
      }
    } catch (error) {
      
      console.error("Error al eliminar el prestamo por ID:", error);
      res.status(500).json({ message: "Error al eliminar el prestamo por ID" });
    }
  });

  app.get("/api/obtenerLoanPorLoan_ID", async (req, res) => {
    try {
      const { Loan_ID } = req.query; 
      const Loan_IDInt = parseInt(Loan_ID);
      const existingLoan = await loans.findOne({ Loan_ID: Loan_IDInt });

      if (existingLoan) {
           // Formatear las fechas
    const loanDateISO = existingLoan.Loan_Date;
    const ExpectDateISO = existingLoan.Actual_Return_Date;
    const ReturnDateISO = existingLoan.Expected_Return_Date;

    // Convertir las fechas a formato "dd-mm-aaaa"
    const loanDate = new Date(loanDateISO);
    const day = String(loanDate.getDate()+1 ).padStart(2, "0");
    const month = String(loanDate.getMonth() + 1).padStart(2, "0");
    const year = loanDate.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;

    const ExpectDate = new Date(ExpectDateISO);
    const day1 = String(ExpectDate.getDate()+1).padStart(2, "0");
    const month1 = String(ExpectDate.getMonth() + 1 ).padStart(2, "0");
    const year1 = ExpectDate.getFullYear();
    const formattedDate1 = `${year1}-${month1}-${day1}`;

    const ReturnDate = new Date(ReturnDateISO);
    const day2 = String(ReturnDate.getDate()+1).padStart(2, "0");
    const month2 = String(ReturnDate.getMonth() + 1).padStart(2, "0");
    const year2 = ReturnDate.getFullYear();
    const formattedDate2 = `${year2}-${month2}-${day2}`;

    // Reemplazar las fechas originales con las fechas formateadas
    existingLoan.Loan_Date = formattedDate;
    existingLoan.Actual_Return_Date = formattedDate1;
    existingLoan.Expected_Return_Date = formattedDate2;

    // Enviar el préstamo en la respuesta JSON
    res.status(200).json(existingLoan);
      } else {
        
        res.status(404).json({ message: 'prestamo no encontrado' });
      }
    } catch (error) {
     
      console.error("Error al obtener el prestamo por ID:", error);
      res.status(500).json({ message: "Error al obtener el prestamo" });
    }
  });

  app.put("/api/editarLoanPorLoan_ID", async (req, res) => {
    try {
      const { Loan_ID } = req.query; 
      const { User_ID, Device_id, Loan_Date, Loan_Status, Actual_Return_Date, Expected_Return_Date, Physical_Condition_Before, Physical_Condition_After, Loan_Comments } = req.body; 
      const Loan_IDInt = parseInt(Loan_ID);
      const result = await loans.updateOne({ Loan_ID: Loan_IDInt }, {
        $set: {
          Loan_ID:parseInt(Loan_ID),
          User_ID,
          Device_id,
          Loan_Date,
          Expected_Return_Date,
          Loan_Status,
          Actual_Return_Date,
          Physical_Condition_Before,
          Physical_Condition_After,
          Loan_Comments
        },
      });
  
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: 'prestamo editado correctamente' });
      } else {
        res.status(404).json({ message: 'prestamo no encontrado' });
      }
    } catch (error) {
      console.error("Error al editar el prestamo por id del prestamo:", error);
      res.status(500).json({ message: "Error al editar el prestamo por id del prestamo" });
    }
  });
  
 
//------------------------------------------------------------------------------------------------------------------------------------
app.listen(config.port, config.hostname, () => {

    console.log(`Servidor iniciado en http://${config.hostname}:${config.port}`);
  });
})();
