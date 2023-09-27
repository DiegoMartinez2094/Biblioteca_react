import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./WorkerPag.css";

export default function WorkerPag() {

  const [formularioLibroVisible, setFormularioLibroVisible] = useState(false);
  const [formularioUsuarioVisible, setFormularioUsuarioVisible] = useState(false);
  
  function toggleFormularioUsuario() {
    setFormularioUsuarioVisible(!formularioUsuarioVisible);
  }
  function toggleFormularioLibro() {
    setFormularioLibroVisible(!formularioLibroVisible);
  }

  const config = JSON.parse(import.meta.env.VITE_My_server);

  const [User_name, setUser_name] = useState("");
  const [Password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onRegistroClick = async () => {
    if (!User_name || !Password || !Email || !Phone || !Address) {
      // Validar que todos los campos estén llenos
      alert("Por favor, complete todos los campos.");
      return;
    }

    if ( Email.indexOf('@') === -1 || Email.indexOf('.') === -1) {
      // Validar que el campo de correo electrónico contenga al menos una "@" y al menos un "."
      alert("Por favor, ingrese un correo electrónico válido.");
      return;
    }

    try {
      // Verificar si el correo electrónico ya está registrado
      const emailExistsResponse = await fetch(
        `http://${config.hostname}:${config.port}/api/verificarEmail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Email }),
        }
      );

      if (emailExistsResponse.status === 200) {
        // El correo electrónico ya está registrado
        alert("Correo electrónico usado anteriormente ");
        return;
      }
      // Obtener el último User_id registrado desde el servidor
      const lastUserIdResponse = await fetch(
        `http://${config.hostname}:${config.port}/api/obtenerUltimoUserId`
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
      const response = await fetch(
        `http://${config.hostname}:${config.port}/api/registrar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

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
    <>
      <h1 style={{ color: "white", textAlign: "center", fontSize: "50px", marginTop: "0px" }}>
        Worker page
      </h1>

      <button id="inscLibro" onClick={toggleFormularioLibro}>
        Registro de libros
      </button>

      <button id="inscLibro" onClick={toggleFormularioUsuario}>
        Registro de usuarios
      </button>

      {formularioLibroVisible && (
        <div id="container1">
          <h1 style={{ marginBottom: "-3px", marginTop: "0px"}} >Libros</h1>
          <div id="register" style={{ display: "flex", alignItems: "center" }}>
            <label id="one" htmlFor="Device_name">
              Nombre:{" "}
            </label>
            &nbsp;&nbsp;
            <input
              type="text"
              id="Device_name"
              name="Device_name"
              /**  
              onChange={onUser_nameChange}
              value={User_name}
              */
            />
          </div>
          <div id="register" style={{ display: "flex", alignItems: "center" }}>
            <label id="one" htmlFor="Description_device">
              Descripcion:{" "}
            </label>
            &nbsp;&nbsp;
            <textarea  style={{minHeight: '70px'}}
              type="text"
              id="Description_device"
              name="Description_device"
              /**  
              onChange={onDescription_deviceChange}
              value={Description_device}
              */
            />
          </div>
          <div id="register" style={{ display: "flex", alignItems: "center" }}>
            <label id="one" htmlFor="Device_category">
              Categoria:{" "}
            </label>
            &nbsp;&nbsp;
            <input
              type="text"
              id="Device_category"
              name="Device_category"
              /**  
              onChange={onDevice_categoryChange}
              value={Device_category}
              */
            />
          </div>
          <div id="register" style={{ display: "flex", alignItems: "center" }}>
            <label id="one" htmlFor="Device_cost">
              Costo:{" "}
            </label>
            &nbsp;&nbsp;
            <input
              type="text"
              id="Device_cost"
              name="Device_cost"
              /**  
              onChange={onDevice_costChange}
              value={Device_cost}
              */
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label id="one" htmlFor="Role">
              Estado:{" "}
            </label>
            &nbsp;&nbsp;
            <select
              id="Device_status"
              name="Device_status" /** onChange={onDevice_statusChange} value={Device_status} */
            >
              <option value="">Seleccione el estado</option>
              <option value="disponible">disponible</option>
              <option value="prestado">prestado</option>
            </select>
            <br />
            <br />
          </div>
          <div id="register" style={{ display: "flex", alignItems: "center" }}>
            <label id="one" htmlFor="Device_comments">
              Comentario:{" "}
            </label>
            &nbsp;&nbsp;
            <textarea
              type="text"
              id="Device_comments"
              name="Device_comments"
              /**  
              onChange={onDevice_commentsChange}
              value={Device_comments}
              */
            />
          </div>
          <h4>Buscar o eliminar libro por el nombre</h4>&nbsp;&nbsp;&nbsp;
      <button id="registro_adm" /**onClick={onRegistroClick} */>
        Registrar libro
      </button>&nbsp;&nbsp; 
      <button id="registro_adm" /**onClick={onSearchUserClick} */>
        Buscar libro
      </button>&nbsp;&nbsp; &nbsp;
      <button id="btnUpdate" /**onClick={onUpdateUserClick} */>
        Editar libro
      </button>&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;
      <Link to={"/"}>
        <button id="btn-atras2">←</button>
      </Link>{" "}
     &nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
      <button id="registro_adm" /**onClick={onDeleteUserClick} */>
        Eliminar usuario
      </button>
        </div>
      )}
      {formularioUsuarioVisible && (
        <div id="container2">
             <h1 style={{ marginBottom: "-3px", marginTop: "0px"}} >Usuarios</h1>
        <div id="register" style={{ display: "flex", alignItems: "center" }}>
          <label id="one" htmlFor="User_name">
            Nombre:{" "}
          </label>
          &nbsp;&nbsp;
          <input
            type="text"
            id="User_name"
            name="User_name"
            onChange={onUser_nameChange}
            value={User_name}
          />
        </div>
        <div id="register" style={{ display: "flex", alignItems: "center" }}>
          <label id="one" htmlFor="Password">
            Contraseña:{" "}
          </label>
          &nbsp;&nbsp;
          <input
            type={showPassword ? "text" : "password"} // Cambiar el tipo de entrada en función de showPassword
            id="Password"
            name="Password"
            onChange={onPasswordChange}
            value={Password}
          />
          &nbsp;&nbsp;
          <button onClick={toggleShowPassword} id="showPassword">
            {showPassword ? (
              <img
                src="../../../public/vista.png"
                id="ceja"
                alt="Ocultar contraseña"
              />
            ) : (
              <img
                src="../../../public/ceja.png"
                id="vista"
                alt="Mostrar contraseña"
              />
            )}
          </button>
        </div>
        <div id="register" style={{ display: "flex", alignItems: "center" }}>
          <label id="one" htmlFor="Email">
            Correo electrónico:{" "}
          </label>
          &nbsp;&nbsp;
          <input
            type="text"
            id="Email"
            name="Email"
            onChange={onEmailChange}
            value={Email}
          />
        </div>
        <div id="register" style={{ display: "flex", alignItems: "center" }}>
          <label id="one" htmlFor="Phone">
            Telefono:{" "}
          </label>
          &nbsp;&nbsp;
          <input
            type="text"
            id="Phone"
            name="Phone"
            onChange={onPhoneChange}
            value={Phone}
          />
        </div>
        <div id="register" style={{ display: "flex", alignItems: "center" }}>
          <label id="one" htmlFor="Address">
            Direccion:{" "}
          </label>
          &nbsp;&nbsp;
          <input
            type="text"
            id="Address"
            name="Address"
            onChange={onAddressChange}
            value={Address}
          />
        </div>
        <Link to={"/"}>
          <button id="btn-atras" >←</button>
        </Link>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button id="registro_adm" onClick={onRegistroClick}>
          Registrar
        </button>
      </div>
      )}
    </>
  );
}
