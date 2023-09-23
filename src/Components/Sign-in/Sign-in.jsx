import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import './Sign-in.css'

export default function SignIn() {
  const [Password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [redirect, setRedirect] = useState(false); // Variable de estado para controlar la redirección
  const [showPassword, setShowPassword] = useState(false); // Variable de estado para mostrar u ocultar la contraseña

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onIngresoClick = async () => {
    if (!Password || !Email) {
      // Validar que todos los campos estén llenos
      alert("Por favor, complete todos los campos.");
      return;
    }

    try {
      // Verificar si el correo electrónico y la contraseña ya están registrados
      const emailycontraseñaExistsResponse = await fetch(
        "http://127.10.10.10:5000/api/verificarEmailyContras",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Email, Password }), // Envía ambos campos en un solo objeto JSON
        }
      );

      if (emailycontraseñaExistsResponse.status === 200) {
        // Credenciales válidas
        setRedirect(true); // Establecer la variable de redirección en true
        setEmail("");
        setPassword("");
      } else if (emailycontraseñaExistsResponse.status === 401) {
        alert("Correo o Contraseña incorrecta");
      } else if (emailycontraseñaExistsResponse.status === 404) {
        // Credenciales incorrectas
        alert("Credenciales no encontradas");
        setEmail("");
        setPassword("");
      } else {
        // Manejar otros errores aquí
        console.error(
          "Error en la solicitud:",
          emailycontraseñaExistsResponse.statusText
        );
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  return (
    <>
      <div id="container">
        <div id="register">
          <label id="one" htmlFor="Email">
            Correo electrónico:{" "}
          </label>
          <br />
          <br />
          <input
            type="text"
            id="Email"
            name="Email"
            onChange={onEmailChange}
            value={Email}
          />
        </div>
        <div id="register">
          <label id="one" htmlFor="Password">
            Contraseña:{" "}
          </label>
          <br />
          <br />
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type={showPassword ? "text" : "password"} // Cambiar el tipo de entrada en función de showPassword
              id="Password"
              name="Password"
              onChange={onPasswordChange}
              value={Password}
            />&nbsp;&nbsp;
            <button onClick={toggleShowPassword} id='showPassword'>
  {showPassword ? (
    <img src="../../../public/vista.png" id='ceja' alt="Ocultar contraseña" />
  ) : (
    <img src="../../../public/ceja.png" id='vista' alt="Mostrar contraseña" />
  )}
</button>
          </div>
        </div>
        <br />
        <Link to={"/"}>
          <button id="registro_adm">Inicio</button>
        </Link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button id="registro_adm" onClick={onIngresoClick}>
          Ingresar
        </button>
        {redirect && <Navigate to="/userpag" />} {/* Redirección condicional */}
      </div>
    </>
  );
}
