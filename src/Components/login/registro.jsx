import { useState } from "react";
import { Link } from "react-router-dom";

import "./registro.css";

//["User_id", "User_name", "Password","Email","Phone","Address","Role"]

export default function RegistroForm() {
  const [User_name, setUser_name] = useState("");
  const [Password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");

  const onUser_nameChange = (e) => {
    setUser_name(e.target.value);
  };
  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const onPhoneChange = (e) => {
    setPhone(e.target.value);
  };
  const onAddressChange = (e) => {
    setAddress(e.target.value);
  };

const onRegistroClick = async () => {
  if (!User_name || !Password || !Email || !Phone || !Address) {
    // Validar que todos los campos estén llenos
    alert("Por favor, complete todos los campos.");
    return;
  }

  try {
     // Verificar si el correo electrónico ya está registrado
     const emailExistsResponse = await fetch('http://127.10.10.10:5000/api/verificarEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email }),
      });
  
      if (emailExistsResponse.status === 200) {
        // El correo electrónico ya está registrado
        alert('Correo electrónico usado anteriormente ');
        return;
      }
    // Obtener el último User_id registrado desde el servidor
    const lastUserIdResponse = await fetch(
      "http://127.10.10.10:5000/api/obtenerUltimoUserId"
    );

    let newUser_id = 1; // Valor predeterminado en caso de que no haya registros

    if (lastUserIdResponse.status === 200) {
      const lastUserIdData = await lastUserIdResponse.json();
      const lastUserId = lastUserIdData.lastUserId || 0; // Si no hay registros, comenzar desde 0

      // Incrementar el User_id para el nuevo usuario
      newUser_id = lastUserId + 1;
    }



    // Agregar el campo "Role" y "User_id" al objeto de datos antes de enviarlo al servidor
    const userData = {
      User_id: newUser_id,
      User_name,
      Password,
      Email,
      Phone,
      Address,
      Role: "usuario",
    };

    // Continuar con el registro
    const response = await fetch("http://127.10.10.10:5000/api/registrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.status === 201) {
      alert("Usuario registrado correctamente");

      // Limpiar los campos después del registro exitoso
      setUser_name("");
      setEmail("");
      setPassword("");
      setPhone("");
      setAddress("");
    } else {
      // Manejar errores aquí
      console.error("Error al registrar usuario registro.jsx");
      alert("Se produjo un error en el registro.");

      setUser_name("");
      setEmail("");
      setPassword("");
      setPhone("");
      setAddress("");
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
  }
};

  

  return (
    <div id="container">
      <div id="register">
        <label id="one" htmlFor="User_name">
          Nombre:{" "}
        </label>
        <input
          type="text"
          id="User_name"
          name="User_name"
          onChange={onUser_nameChange}
          value={User_name}
        />
      </div>
      <div id="register">
        <label id="one" htmlFor="Password">
          Contraseña:{" "}
        </label>
        <input
          type="password"
          id="Password"
          name="Password"
          onChange={onPasswordChange}
          value={Password}
        />
      </div>
      <div id="register">
        <label id="one" htmlFor="Email">
          Correo electrónico:{" "}
        </label>
        <input
          type="text"
          id="Email"
          name="Email"
          onChange={onEmailChange}
          value={Email}
        />
      </div>
      <div id="register">
        <label id="one" htmlFor="Phone">
          Telefono:{" "}
        </label>
        <input
          type="text"
          id="Phone"
          name="Phone"
          onChange={onPhoneChange}
          value={Phone}
        />
      </div>
      <div id="register">
        <label id="one" htmlFor="Address">
          Direccion:{" "}
        </label>
        <input
          type="text"
          id="Address"
          name="Address"
          onChange={onAddressChange}
          value={Address}
        />
      </div>
     
      <Link to={"/"}>
        <button id="registro_adm">Inicio</button>
      </Link>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <button id="registro_adm" onClick={onRegistroClick}>
        Registrar
      </button>
    </div>
  );
}
