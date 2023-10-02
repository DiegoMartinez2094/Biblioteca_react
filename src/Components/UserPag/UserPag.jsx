import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate desde React Router
import "./UserPag.css";

export default function UserPag() {
  // Estado para almacenar el nombre de usuario
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  // Función para analizar las cookies y obtener el nombre de usuario y el id
  const getUserNameFromCookie = () => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === "User_name") {
        return decodeURIComponent(value);
      }
    }

    const getUserIdFromCookie = () => {
      const cookies = document.cookie.split("; ");
      for (const cookie of cookies) {
        const [Id, value] = cookie.split("=");
        if (Id === "User_id") {
          return decodeURIComponent(value);
        }
      }
    };
    return "";
  };
  // Función para verificar si la cookie ha caducado
  const isCookieActive = () => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === "User_name") {
        // Verificar si la cookie está vacía o no
        return !!value; // Devuelve true si la cookie tiene un valor
      }
    }
    return false; // La cookie no está presente
  };
  // Obtiene la función de navegación desde React Router
  const navigate = useNavigate();
  // Función para eliminar todas las cookies
  const deleteAllCookies = () => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, _] = cookie.split("=");
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  };
  // Cuando el componente se monta y en cada renderizado, obtén el nombre de usuario de la cookie y verifica la cookie
  useEffect(() => {
    const nameFromCookie = getUserNameFromCookie();
    setUserName(nameFromCookie);

    // Verificar si la cookie ha caducado y redirigir al componente SessionExpired
    if (!isCookieActive()) {
      navigate("/SessionExpired"); // Redirige al componente SessionExpired
    }
  }, [navigate]);

  const config = JSON.parse(import.meta.env.VITE_My_server);

  //----------------------------------------------------------------------------------------------------------
  //Libros

  const [listadoLibrosVisible, setlistadoLibrosVisible] = useState(false);
  const [devices, setDevices] = useState([]);

  function togglelistadoLibros() {
    setlistadoLibrosVisible(!listadoLibrosVisible);
  }

  const [Device_id, setDevice_id] = useState("");
  const [Device_name, setDevice_name] = useState("");
  const [Description_device, setDescription_device] = useState("");
  const [Device_category, setDevice_category] = useState("");
  const [Device_cost, setDevice_cost] = useState("");
  const [Device_status, setDevice_status] = useState("");
  const [Device_comments, setDevice_comments] = useState("");
  const [foundDevice, setFoundDevice] = useState(null);

  const onDevice_idChange = (e) => {
    setDevice_id(e.target.value);
  };
  const onDevice_nameChange = (e) => {
    setDevice_name(e.target.value);
  };
  const onDescription_deviceChange = (e) => {
    setDescription_device(e.target.value);
  };
  const onDevice_categoryChange = (e) => {
    setDevice_category(e.target.value);
  };
  const onDevice_costChange = (e) => {
    setDevice_cost(e.target.value);
  };
  const onDevice_statusChange = (e) => {
    setDevice_status(e.target.value);
  };
  const onDevice_commentsChange = (e) => {
    setDevice_comments(e.target.value);
  };

  useEffect(() => {
    loadDeviceFields(); // Cargar los campos de entrada cuando se actualice
  }, [foundDevice]);

  const loadDeviceFields = () => {
    setDevice_id(foundDevice ? foundDevice.Device_id : "");
    setDevice_name(foundDevice ? foundDevice.Device_name : "");
    setDescription_device(foundDevice ? foundDevice.Description_device : "");
    setDevice_category(foundDevice ? foundDevice.Device_category : "");
    setDevice_cost(foundDevice ? foundDevice.Device_cost : "");
    setDevice_status(foundDevice ? foundDevice.Device_status : "");
    setDevice_comments(foundDevice ? foundDevice.Device_comments : "");
  };

  const onShowTableclick = async () => {
    try {
      const Device_idExistsResponse = await fetch(
        `http://${config.hostname}:${config.port}/api/obtenerDevices`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (Device_idExistsResponse.status === 200) {
        const data = await Device_idExistsResponse.json();
        setDevices(data); // Guardar los dispositivos en el estado
        setListadoLibrosVisible(true); // Mostrar la tabla
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };
  //----------------------------------------------------------------------------------------------------

  return (
    <>
      <button
        id="btnSalirUser"
        onClick={() => {
          deleteAllCookies();
          navigate("/");
        }}
      >
        Cerrar sesión
      </button>

      <h1 id="holausuario">Hola, {userName}</h1>
      <div>
        {" "}
        <button
          id="listadoLibros"
          style={{ marginLeft: "50px", marginBottom: "10px" }}
          onClick={togglelistadoLibros}
        >
          Listado de Libros
        </button>
      </div>
      <button
        onClick={onShowTableclick}
        style={{ marginLeft: "100px", fontSize: "30px" }}
      >
        Refrescar tabla
      </button>

      {listadoLibrosVisible && (
        <div id="deviceList">
          {devices.map((device) => (
            <div key={device._id} class="container">
              <div class="book">
                <h5 id="resumen">
                {device.Description_device}
                </h5>
                <button id="btn_prestar">prestar</button>
                <button id="btn_reservar">reservar</button>
                <div class="cover">
                  <h2>{device.Device_name}</h2>
                  <p>{device.Device_category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
