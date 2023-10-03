import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Draggable from "react-draggable";
import "./UserPag.css";

export default function UserPag() {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  //------------------------------------------------------------------------------------------------------------------------------------------------------------
  //uso de cokkies

  // Función para analizar las cookies y obtener el nombre de usuario
  const getUserNameFromCookie = () => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === "User_name") {
        return decodeURIComponent(value);
      }
    }
    return "";
  };

  // Función para analizar las cookies y obtener el id de usuario
  const getUserIdFromCookie = () => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === "User_id") {
        return decodeURIComponent(value);
      }
    }
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

    const UserIdFromCookie = getUserIdFromCookie();
    setUserId(UserIdFromCookie);
    // Verificar si la cookie ha caducado y redirigir al componente SessionExpired
    if (!isCookieActive()) {
      navigate("/SessionExpired"); // Redirige al componente SessionExpired
    }
  }, [navigate]);

  const config = JSON.parse(import.meta.env.VITE_My_server);

  //----------------------------------------------------------------------------------------------------------
  //CardsBooks

  const [listadoLibrosVisible, setlistadoLibrosVisible] = useState(false);
  const [devices, setDevices] = useState([]);
  const [showLoanForm, setShowLoanForm] = useState(false);

  const onPrestarClick = () => {
    setShowLoanForm(true);
    setDevice_id(deviceInfo.Device_id);
  };

  function togglelistadoLibros() {
    setlistadoLibrosVisible(!listadoLibrosVisible);
  }

  const [Device_id, setDevice_id] = useState("");
  const [foundDevice, setFoundDevice] = useState(null);
  const onDevice_idChange = (e) => {
    setDevice_id(e.target.value);
  };

  useEffect(() => {
    loadDeviceFields(); // Cargar los campos de entrada cuando se actualice
  }, [foundDevice]);

  const loadDeviceFields = () => {
    setDevice_id(foundDevice ? foundDevice.Device_id : "");
  };

  const onShowCardsBooksclick = async () => {
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
        setlistadoLibrosVisible(true); // Mostrar la tabla
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };
  //---------------------------------------------------------------------------------------------------------------------
  //PRESTAMO

  const [Loan_ID, setLoan_ID] = useState("");
  const [User_ID, setUser_ID] = useState("");
  const [Loan_Date, setLoan_Date] = useState("");
  const [Expected_Return_Date, setExpected_Return_Date] = useState("");
  const [Loan_Status, setLoan_Status] = useState("");

  const [foundLoan, setFoundLoan] = useState(null);

  const onLoan_DateChange = (e) => {
    setLoan_Date(e.target.value);
  };

  const onExpected_Return_DateChange = (e) => {
    setExpected_Return_Date(e.target.value);
  };

  useEffect(() => {
    loadLoanFields(); // Cargar los campos de entrada cuando foundLoan se actualice
  }, [foundLoan]);

  const loadLoanFields = () => {
    setDevice_id(foundLoan ? foundLoan.Device_id : "");
    setLoan_Date(foundLoan ? foundLoan.Loan_Date : "");
    setExpected_Return_Date(foundLoan ? foundLoan.Expected_Return_Date : "");
    setLoan_Status(foundLoan ? foundLoan.Loan_Status : "");
  };

  const onRegistroLoanClick = async () => {
    if (!Device_id || !Loan_Date || !Expected_Return_Date) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const loanDate = new Date(Loan_Date);
    const expectedReturnDate = new Date(Expected_Return_Date);

    // Validar que Loan_Date sea anterior a Expected_Return_Date
    if (loanDate >= expectedReturnDate) {
      alert(
        "La fecha de préstamo debe ser anterior a la fecha esperada devolucion."
      );
      return;
    }

    // obtener el ultimo loan_id
    const lastLoanIdResponse = await fetch(
      `http://${config.hostname}:${config.port}/api/obtenerUltimoLoaId`
    );

    let newLoan_id = 1; // Valor predeterminado en caso de que no haya registros

    if (lastLoanIdResponse.status === 200) {
      const lastLoanIdData = await lastLoanIdResponse.json();
      const lastLoanId = lastLoanIdData.lastLoanId || 0; // Si no hay registros, comenzar desde 0
     
      // Incrementar el User_id para el nuevo usuario
      newLoan_id = lastLoanId + 1;
    }
    const loanData = {
      Loan_ID: newLoan_id,
      User_ID: parseInt(userId),
      Device_id: parseInt(Device_id),
      Loan_Date: new Date(Loan_Date),
      Expected_Return_Date: new Date(Expected_Return_Date),
      Loan_Status: "pendiente",
      Actual_Return_Date: "",
      Physical_Condition_Before: "",
      Physical_Condition_After: "",
      Loan_Comments: "",
    };

    try {
      const response = await fetch(
        `http://${config.hostname}:${config.port}/api/registrarLoan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loanData),
        }
      );

      if (response.status === 201) {
        alert("prestamo registrado correctamente");

        setDevice_id("");
        setLoan_Date("");
        setExpected_Return_Date("");
      } else {
        console.error("Error al registrar prestamo registro");
        alert("Se produjo un error en el registro. :(");
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
      <div>
        <h1 id="holausuario">Hola {userName.replace(/"/g, "")} :)</h1>
      </div>

      <button className="button" onClick={onShowCardsBooksclick}>
        Mostrar libros
      </button>

      <button className="button" onClick={togglelistadoLibros}>
        Ocultar libros
      </button>

      {listadoLibrosVisible && (
        <div id="deviceList">
          {devices.map((device) => (
            <div key={device._id} className="container">
              <div className="book">
                <h5 id="resumen">{device.Description_device}</h5>

                <button className="button">
                  <span className="button_lg">
                    <span className="button_sl"></span>
                    <span
                      className="button_text"
                      onClick={() =>
                        onPrestarClick({
                          Device_id: device.Device_id,
                          Device_name: device.Device_name,
                          Description_device: device.Description_device,
                          Device_category: device.Device_category,
                        })
                      }
                    >
                      Prestar
                    </span>
                  </span>
                </button>

                <div className="cover">
                  <h3> Id: {device.Device_id}</h3>
                  <h2>{device.Device_name}</h2>
                  <p>{device.Device_category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showLoanForm && (
        <Draggable>
          <div id="formRegisLoanss">
            <h1>Formulario de prestamo</h1>

            <div
              id="register"
              style={{ display: "flex", alignItems: "center" }}
            >
              <label
                id="one"
                htmlFor="Device_id"
                style={{ width: "150%", fontSize: "30px" }}
              >
                Id del libro:{" "}
              </label>
              &nbsp;&nbsp;
              <input
                type="text"
                id="Device_id"
                name="Device_id"
                onChange={onDevice_idChange}
                value={Device_id}
              />
            </div>
            <div
              id="register"
              style={{ display: "flex", alignItems: "center" }}
            >
              <label
                id="one"
                htmlFor="Loan_Date"
                style={{ width: "150%", fontSize: "30px" }}
              >
                Fecha de prestamo:{" "}
              </label>
              &nbsp;&nbsp;
              <input
                type="date"
                id="Loan_Date"
                name="Loan_Date"
                onChange={onLoan_DateChange}
                value={Loan_Date}
              />
            </div>
            <div
              id="register"
              style={{ display: "flex", alignItems: "center" }}
            >
              <label
                id="one"
                htmlFor="Expected_Return_Date"
                style={{ width: "150%", fontSize: "30px" }}
              >
                Fecha esperada devolucion:{" "}
              </label>
              &nbsp;&nbsp;
              <input
                type="date"
                id="Expected_Return_Date"
                name="Expected_Return_Date"
                onChange={onExpected_Return_DateChange}
                value={Expected_Return_Date}
              />
            </div>
            <br />
            <div>
              <br />
              <button id="cancelButton" onClick={() => setShowLoanForm(false)}>
                Cancelar
              </button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <button id="prestarButton" onClick={() => onRegistroLoanClick()}>
                Prestar
              </button>
            </div>
          </div>
        </Draggable>
      )}
    </>
  );
}
