import { useState } from "react";
import { Link } from "react-router-dom";
import ReactModal from "react-modal";

import "./registro.css";

export default function RegistroForm() {
  const [emailModalIsOpen, setEmailModalIsOpen] = useState(false);
  const [fieldsModalIsOpen, setFieldsModalIsOpen] = useState(false);
  const [successModalIsOpen, setSuccessModalIsOpen] = useState(false);
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);

  //-----------------------------------------------------------------------------------------------------------------------------------------
  //modales:

  const openEmailModal = () => {
    setEmailModalIsOpen(true);
  };

  const closeEmailModal = () => {
    setEmailModalIsOpen(false);
  };

  const openFieldsModal = () => {
    setFieldsModalIsOpen(true);
  };

  const closeFieldsModal = () => {
    setFieldsModalIsOpen(false);
  };

  const openSuccessModal = () => {
    setSuccessModalIsOpen(true);
  };

  const closeSuccessModal = () => {
    setSuccessModalIsOpen(false);
  };

  const openErrorModal = () => {
    setErrorModalIsOpen(true);
  };

  const closeErrorModal = () => {
    setErrorModalIsOpen(false);
  };

  //--------------------------------------------------------------------------------------------------------------------------------------------

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
      openFieldsModal();
      return;
    }

    if (Email.indexOf("@") === -1 || Email.indexOf(".") === -1) {
      // Validar que el campo de correo electrónico contenga al menos una "@" y al menos un "."

      openEmailModal();
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
        openErrorModal();
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
        openSuccessModal();

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
      <ReactModal
        isOpen={emailModalIsOpen}
        onRequestClose={closeEmailModal}
        contentLabel="Mensaje de correo electrónico no válido"
        ariaHideApp={false} // Necesario para evitar errores de accesibilidad
        className="modal-content" // Estilos CSS para el modal
        overlayClassName="modal-overlay" // Estilos CSS para el fondo del modal
      >
        <h4 id="textModal">Por favor, ingrese un correo electrónico válido</h4>
        <button onClick={closeEmailModal}>Cerrar</button>
      </ReactModal>
      {/* Modal para campos faltantes */}
      <ReactModal
        isOpen={fieldsModalIsOpen}
        onRequestClose={closeFieldsModal}
        contentLabel="Campos faltantes"
        ariaHideApp={false} // Necesario para evitar errores de accesibilidad
        className="modal-content" // Estilos CSS para el modal
        overlayClassName="modal-overlay" // Estilos CSS para el fondo del modal
      >
        <h4 id="textModal">Por favor, complete todos los campos.</h4>
        <button onClick={closeFieldsModal}>Cerrar</button>
      </ReactModal>
      {/* Modal para registro exitoso */}
      <ReactModal
        isOpen={successModalIsOpen}
        onRequestClose={closeSuccessModal}
        contentLabel="Registro exitoso"
        ariaHideApp={false} // Necesario para evitar errores de accesibilidad
        className="modal-content" // Estilos CSS para el modal
        overlayClassName="modal-overlay" // Estilos CSS para el fondo del modal
      >
        <div>
          <h4 id="textModal">Usuario registrado correctamente.</h4>
          <button onClick={closeSuccessModal}>Cerrar</button>
        </div>
      </ReactModal>
      {/* Modal para error en el registro */}
      <ReactModal
        isOpen={errorModalIsOpen}
        onRequestClose={closeErrorModal}
        contentLabel="Error en el registro"
        ariaHideApp={false} // Necesario para evitar errores de accesibilidad
        className="modal-content" // Estilos CSS para el modal
        overlayClassName="modal-overlay" // Estilos CSS para el fondo del modal
      >
        <div>
          <h4 id="textModal">Este orreo Electronico ya lo usa otro usuario.</h4>
          <button onClick={closeErrorModal}>Cerrar</button>
        </div>
      </ReactModal>
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
        <button id="btn-atras">←</button>
      </Link>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button id="registro_adm" onClick={onRegistroClick}>
        Registrar
      </button>
    </div>
  );
}
