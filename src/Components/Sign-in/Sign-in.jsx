import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "./Sign-in.css";
import ReactModal from 'react-modal';


export default function SignIn() {
  const config = JSON.parse(import.meta.env.VITE_My_server);
//---------------------------------------------------------------------------------------
//MODALES

const [modalIsOpen, setModalIsOpen] = useState(false);
const [modalMessage, setModalMessage] = useState(false);
const [modalIsOpen2, setModalIsOpen2] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openModal2 = () => {
    setModalIsOpen2(true);
  };

  const closeModal2 = () => {
    setModalIsOpen2(false);
  };

  
  const openModal1 = () => {
    setModalMessage(true);
  };

  const closeModal1 = () => {
    setModalMessage(false);
  };



  //---------------------------------------------------------------------------------------
  
  const [Password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [redirectUserPag, setRedirectUserPag] = useState(false);
  const [redirectAdmPag, setRedirectAdmPag] = useState(false);
  const [redirectWorkerPag , setRedirectWorkerPag] = useState(false);
  // Variable de estado para controlar la redirección
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
    openModal();
    return;
  }

  try {
    const emailycontraseñaExistsResponse = await fetch(
      `http://${config.hostname}:${config.port}/api/verificarEmailyContras`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email, Password }),
      }
    );

    if (emailycontraseñaExistsResponse.ok) {
      const responseData = await emailycontraseñaExistsResponse.json();
   
      const userType = responseData.userType;
      const User_name = responseData.User_name;
      const User_id = responseData.User_id;
 

      const maxAgeInSeconds =3600; //segundo de expiracion de la cookie (1hora)

      // Calcula la fecha de expiración
      const expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + maxAgeInSeconds * 1000);
      
      // Almacena la cookie en el navegador con max-age
      document.cookie = `User_id=${JSON.stringify(User_id)}; path=/; max-age=${maxAgeInSeconds}; expires=${expirationDate.toUTCString()}`;
      document.cookie = `User_name=${JSON.stringify(User_name)}; path=/; max-age=${maxAgeInSeconds}; expires=${expirationDate.toUTCString()}`;
      document.cookie = `userType=${JSON.stringify(userType)}; path=/; max-age=${maxAgeInSeconds}; expires=${expirationDate.toUTCString()}`;
      
      if (userType === "administrador") {
        setRedirectAdmPag(true);
      } else if (userType === "trabajador") {
        setRedirectWorkerPag(true);
      } else if (userType === "usuario") {
        setRedirectUserPag(true);
      }

      setEmail("");
      setPassword("");
    } else if (emailycontraseñaExistsResponse.status === 401) {
      
      openModal1();
    } else if (emailycontraseñaExistsResponse.status === 404) {
      // Credenciales incorrectas
      
      openModal2();
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
     <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Campos faltantes"
        ariaHideApp={false}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div>
          <h4 id="textModal">Por favor, complete todos los campos.</h4>
          <button onClick={closeModal}>Cerrar</button>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={modalIsOpen2}
        onRequestClose={closeModal2}
        contentLabel="Campos no encontrados"
        ariaHideApp={false}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div>
          <h4 id="textModal">Credenciales no encontradas</h4>
          <button onClick={closeModal2}>Cerrar</button>
        </div>
      </ReactModal>

      <ReactModal
        isOpen={modalMessage}
        onRequestClose={closeModal1}
        contentLabel="Campos faltantes"
        ariaHideApp={false}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div>
          <h4 id="textModal">Correo o Contraseña incorrecta</h4>
          <button onClick={closeModal1}>Cerrar</button>
        </div>
      </ReactModal>

      <div id="container">

        <div id="register" style={{ display: "flex", alignItems: "center" }}>
          <label id="one" htmlFor="Email">
            Correo electrónico:{" "}
          </label>
          &nbsp;&nbsp;
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
        <div id="register" style={{ display: "flex", alignItems: "center" }}>
          <label id="one" htmlFor="Password">
            Contraseña:{" "}
          </label>
          &nbsp;&nbsp;
          <br />
          <br />
          <div style={{ display: "flex", alignItems: "center" }}>
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
        </div>
        <br />
        <Link to={"/"}>
          <button id="btn-atras">←</button>
        </Link>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button id="registro_adm" onClick={onIngresoClick}>
          Ingresar
        </button>
        {redirectAdmPag && <Navigate to="/admpag" />}
        {redirectUserPag && <Navigate to="/userpag" />}
        {redirectWorkerPag && <Navigate to="/Workerpag" />}
      </div>
    </>
  );
}
