import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

export default function SignIn() {
  const [Password, setPassword] = useState('');
  const [Email, setEmail] = useState('');
  const [redirect, setRedirect] = useState(false); // Variable de estado para controlar la redirección

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onIngresoClick = async () => {
    if (!Password || !Email) {
      // Validar que todos los campos estén llenos
      alert("Por favor, complete todos los campos.");
      return;
    }

    try {
      // Verificar si el correo electrónico y la contraseña ya están registrados
      const emailycontraseñaExistsResponse = await fetch('http://127.10.10.10:5000/api/verificarEmailyContras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email, Password }), // Envía ambos campos en un solo objeto JSON
      });

      if (emailycontraseñaExistsResponse.status === 200) {
        // Credenciales válidas
        setRedirect(true); // Establecer la variable de redirección en true
        setEmail("");
        setPassword("");
      } else if (emailycontraseñaExistsResponse.status === 401) {
        // Credenciales incorrectas
        alert('Credenciales incorrectas');
        setEmail("");
        setPassword("");
      } else {
        // Manejar otros errores aquí
        console.error("Error en la solicitud:", emailycontraseñaExistsResponse.statusText);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  return (
    <>
      <div id='container'>
        <div id='register'>
          <label id='one' htmlFor="Email">Correo electrónico: </label>
          <br/><br/>
          <input 
            type="text"
            id="Email"
            name="Email"
            onChange={onEmailChange}
            value={Email}
          />
        </div>
        <div id='register'>
          <label id='one' htmlFor="Password">Contraseña: </label>
          <br/><br/>
          <input
            type="password"
            id="Password"
            name="Password"
            onChange={onPasswordChange}
            value={Password}
          />
        </div>
        <br/>
        <Link to={"/"}><button id='registro_adm'>Inicio</button></Link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button id='registro_adm' onClick={onIngresoClick}>Ingresar</button>
        {redirect && <Navigate to="/userpag" />} {/* Redirección condicional */}
      </div>
    </>
  )
}
