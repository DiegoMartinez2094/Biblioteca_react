import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../login/registro.css";

export default function PrestamoWorker() {
  const config = JSON.parse(import.meta.env.VITE_My_server);

  const [Loan_ID, setLoan_ID] = useState("");
  const [User_ID, setUser_ID] = useState("");
  const [Device_id, setDevice_id] = useState("");
  const [Loan_Date, setLoan_Date] = useState("");
  const [Expected_Return_Date, setExpected_Return_Date] = useState("");
  const [Actual_Return_Date, setActual_Return_Date] = useState("");
  const [Loan_Status, setLoan_Status] = useState("");
  const [Loan_Comments, setLoan_Comments] = useState("");
  const [Physical_Condition_Before, setPhysical_Condition_Before] = useState("");
  const [Physical_Condition_After, setPhysical_Condition_After] = useState("");


  const [foundLoan, setFoundLoan] = useState(null);


  const onUser_IDChange = (e) => {
    setUser_ID(e.target.value);
  };
  const onDevice_idChange = (e) => {
    setDevice_id(e.target.value);
  };
  const onLoan_DateChange = (e) => {
    setLoan_Date(e.target.value);
  };
  const onExpected_Return_DateChange = (e) => {
    setExpected_Return_Date(e.target.value);
  };
  const onLoan_StatusChange = (e) => {
    setLoan_Status(e.target.value);
  };
  const onLoan_Comments = (e) => {
    setLoan_Comments(e.target.value);
  };
  const onPhysical_Condition_BeforeChange = (e) => {
    setPhysical_Condition_Before(e.target.value);
  };
  const onPhysical_Condition_AfterChange = (e) => {
    setPhysical_Condition_After(e.target.value);
  };


  useEffect(() => {
    loadUserFields(); // Cargar los campos de entrada cuando foundLoan se actualice
  }, [foundLoan]);

  const loadUserFields = () => {
    setUser_ID(foundLoan ? foundLoan.User_ID : "");
    setDevice_id(foundLoan ? foundLoan.Device_id : "");
    setLoan_Date(foundLoan ? foundLoan.Loan_Date : "");
    setExpected_Return_Date(foundLoan ? foundLoan.Expected_Return_Date : "");
    setLoan_Status(foundLoan ? foundLoan.Loan_Status : "");
    setLoan_Comments (foundLoan ? foundLoan.Loan_Comments  : "");
    setPhysical_Condition_Before(foundLoan ? foundLoan.Physical_Condition_Before : "");
    setPhysical_Condition_After(foundLoan ? foundLoan.Physical_Condition_After : "");
  };

  const onRegistroClick = async () => {
    if (!Loan_ID || !User_ID || !Device_id || !Loan_Date || !Expected_Return_Date || !Loan_Status || !Loan_Comments|| !Physical_Condition_Before || !Physical_Condition_After) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    try {
      // Obtener el último User_id registrado desde el servidor
      const lastLoanIdResponse = await fetch(
        `http://${config.hostname}:${config.port}/api/obtenerUltimoLoanId`
      );

      let newLoan_id = 1; // Valor predeterminado en caso de que no haya registros

      if (lastLoanIdResponse.status === 200) {
        const lastUserIdData = await lastLoanIdResponse.json();
        const lastUserId = lastUserIdData.lastUserId || 0; // Si no hay registros, comenzar desde 0

        // Incrementar el User_id para el nuevo usuario
        newLoan_id = lastUserId + 1;
      }

      // Agregar el campo "Actual_Return_Date" y "User_id" al objeto de datos antes de enviarlo al servidor
      const loanData = {
        Loan_ID: newLoan_id,
        User_ID,
        Device_id,
        Loan_Date,
        Expected_Return_Date,
        Loan_Status,
        Actual_Return_Date,
        Physical_Condition_Before,
        Physical_Condition_After
      };

      // Continuar con el registro
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
        // Limpiar los campos después del registro exitoso
        setUser_ID("");
        setDevice_id("");
        setLoan_Date("");
        setExpected_Return_Date("");
        setLoan_Status("");
        setPhysical_Condition_Before("");
        setPhysical_Condition_After("");
      } else {
        console.error("Error al registrar prestamo registro.jsx");
        alert("Se produjo un error en el registro.");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

//revisar lo de Loan_ID ya que con ese se va a buscar el prestamo por eso no puede ser autoincrementable
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const onSearchLoanClick = async () => {
    if (!Device_id) {
      alert("Por favor, ingrese un Correo electrónico");
      return;
    }
    try {
      const Device_idExistsResponse = await fetch(
        `http://${config.hostname}:${config.port}/api/verificarDevice_id`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Device_id }),
        }
      );

      if (Device_idExistsResponse.status === 200) {
        const userDataResponse = await fetch(
          `http://${config.hostname}:${config.port}/api/obtenerUsuarioPorDevice_id?Device_id=${Device_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (userDataResponse.status === 200) {
          const userData = await userDataResponse.json();
          setFoundLoan(userData);
        }
      } else {
        alert("Correo electrónico no encontrado");
        setFoundLoan(null);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const onDeleteUserClick = async () => {
    if (!Device_id) {
      alert("Por favor, ingrese un Correo electrónico");
      return;
    }
    try {
      const Device_idExistsResponse = await fetch(
        `http://${config.hostname}:${config.port}/api/verificarDevice_id`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Device_id }),
        }
      );

      if (Device_idExistsResponse.status === 200) {
        const userDataDelete = await fetch(
          `http://${config.hostname}:${config.port}/api/eliminarUsuarioPorDevice_id?Device_id=${Device_id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (userDataDelete.status === 200) {
          alert("Usuario eliminado exitosamente");

          setDevice_id("");
          setUser_ID("");
          setLoan_Date("");
          setExpected_Return_Date("");
          setActual_Return_Date("");
        } else {
          alert("Correo electrónico no encontrado");
          setFoundLoan(null);
        }
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const onUpdateUserClick = async () => {
    if (!Loan_ID || !User_ID || !Device_id || !Loan_Date || !Expected_Return_Date) {
      // Validar que todos los campos estén llenos
      alert("Por favor, complete todos los campos.");
      return;
    }
  
    try {
      const Device_idExistsResponse = await fetch(
        `http://${config.hostname}:${config.port}/api/verificarDevice_id`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Device_id }),
        }
      );

      if (Device_idExistsResponse.status === 200) {
        const userDataUpdate = await fetch(
          `http://${config.hostname}:${config.port}/api/editarUsuarioPorDevice_id?Device_id=${Device_id}`,
          {
            method: "PUT", // Cambia "UPDATE" a "PUT" para indicar que es una solicitud de actualización
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Loan_ID,
              User_ID,
              Device_id,
              Loan_Date,
              Expected_Return_Date,
              Actual_Return_Date,
            }),
          }
        );

        if (userDataUpdate.status === 200) {
          alert("Usuario editado exitosamente");

          setDevice_id("");
          setUser_ID("");
          setLoan_Date("");
          setExpected_Return_Date("");
          setActual_Return_Date("");
        } else {
          alert("Correo electrónico no encontrado");
          setFoundLoan(null);
        }
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };



  return (
    <div id="container">
      <div id="register" style={{ display: "flex", alignItems: "center" }}>
        <label id="one" htmlFor="User_ID">
        Id del usuario:{" "}
        </label>
        &nbsp;&nbsp;
        <input
          type="text"
          id="User_ID"
          name="User_ID"
          onChange={onUser_IDChange}
          value={User_ID}
        />
      </div>
      <div id="register" style={{ display: "flex", alignItems: "center" }}>
        <label id="one" htmlFor="User_ID">
          Id del libro:{" "}
        </label>
        &nbsp;&nbsp;
        <input
          type={showLoan_ID ? "text" : "User_ID"}
          id="User_ID"
          name="User_ID"
          onChange={onUser_IDChange}
          value={User_ID}
        />
        &nbsp;&nbsp;
       
      </div>
      <div id="register" style={{ display: "flex", alignItems: "center" }}>
        <label id="one" htmlFor="Device_id">
          Correo electrónico:{" "}
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
      <div id="register" style={{ display: "flex", alignItems: "center" }}>
        <label id="one" htmlFor="Loan_Date">
          Telefono:{" "}
        </label>
        &nbsp;&nbsp;
        <input
          type="text"
          id="Loan_Date"
          name="Loan_Date"
          onChange={onLoan_DateChange}
          value={Loan_Date}
        />
      </div>
      <div id="register" style={{ display: "flex", alignItems: "center" }}>
        <label id="one" htmlFor="Expected_Return_Date">
          Direccion:{" "}
        </label>
        &nbsp;&nbsp;
        <input
          type="text"
          id="Expected_Return_Date"
          name="Expected_Return_Date"
          onChange={onExpected_Return_DateChange}
          value={Expected_Return_Date}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <label id="one" htmlFor="Actual_Return_Date">
          Rol del usuario:{" "}
        </label>
        &nbsp;&nbsp;
        <select id="Actual_Return_Date" name="Actual_Return_Date" onChange={onActual_Return_DateChange} value={Actual_Return_Date}>
          <option value="">Seleccione el rol</option>
          <option value="administrador">Administrador</option>
          <option value="trabajador">Trabajador</option>
          <option value="usuario">Usuario</option>
        </select>
        <br />
        <br />
        
      </div>
      <h4>Buscar o eliminar usuario por el correo</h4>&nbsp;&nbsp;&nbsp; &nbsp;
      <button id="registro_adm" onClick={onRegistroClick}>
        Registrar usuario
      </button>
      <button id="registro_adm" onClick={onSearchUserClick}>
        Buscar usuario
      </button>
      <button id="btnUpdate" onClick={onUpdateUserClick}>
        Editar usuario
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      &nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;
      <Link to={"/"}>
        <button id="btn-atras2">←</button>
      </Link>{" "}
      &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
      <button id="registro_adm" onClick={onDeleteUserClick}>
        Eliminar usuario
      </button>
    </div>
  );
}
