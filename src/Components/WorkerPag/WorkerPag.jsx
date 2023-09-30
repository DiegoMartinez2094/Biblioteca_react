import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./WorkerPag.css";

export default function WorkerPag() {
  const [formularioLibroVisible, setFormularioLibroVisible] = useState(false);
  const [formularioUsuarioVisible, setFormularioUsuarioVisible] =
    useState(false);
  const [listadoLibrosVisible, setlistadoLibrosVisible] = useState(false);
  const [formularioPrestamosVisible, setFormularioPrestamosVisible] =
    useState(false);

  const [devices, setDevices] = useState([]);

  // const [loans, setLoans] = useState([]);    variable para ver todos los prestamos

  function toggleFormularioPrestamos() {
    setFormularioPrestamosVisible(!formularioPrestamosVisible);
  }

  function toggleFormularioUsuario() {
    setFormularioUsuarioVisible(!formularioUsuarioVisible);
  }
  function toggleFormularioLibro() {
    setFormularioLibroVisible(!formularioLibroVisible);
  }

  function togglelistadoLibros() {
    setlistadoLibrosVisible(!listadoLibrosVisible);
  }

  const config = JSON.parse(import.meta.env.VITE_My_server);

  //---------------------------------------------------------------------------------------------------------------------------------------------
  //Usuarios
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

    if (Email.indexOf("@") === -1 || Email.indexOf(".") === -1) {
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

  //-------------------------------------------------------------------------------------------------------------------------------------------
  //libros
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

  const onRegistroDeviceClick = async () => {
    if (
      !Device_id ||
      !Device_name ||
      !Description_device ||
      !Device_category ||
      !Device_cost ||
      !Device_status
    ) {
      alert("Todos los campos son requeridos excepto el de comentario"); // Validar que todos los campos estén llenos
      return;
    }

    try {
      // Verificar si el Libro ya está registrado
      const existingDevice = await fetch(
        `http://${config.hostname}:${config.port}/api/verificarDevice_id`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Device_id: parseInt(Device_id) }),
        }
      );

      if (existingDevice.status === 200) {
        // El libro ya está registrado
        alert("Id Libro registrado anteriormente ");
        return;
      }

      const DataBook = {
        Device_id: parseInt(Device_id),
        Device_name,
        Description_device,
        Device_category,
        Device_cost,
        Device_status,
        Device_comments,
      };
      // Continuar con el registro del libro
      const response = await fetch(
        `http://${config.hostname}:${config.port}/api/registrarDevice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(DataBook),
        }
      );
      console.log(response.status);
      if (response.status === 201) {
        alert("Libro registrado correctamente");

        // Limpiar los campos después del registro exitoso
        setDevice_id("");
        setDevice_name("");
        setDescription_device("");
        setDevice_category("");
        setDevice_cost("");
        setDevice_status("");
        setDevice_comments("");
      } else {
        // Manejar errores aquí
        console.error("Error al registrar Libro");
        alert("Se produjo un error en el registro del libro.");

        setDevice_id("");
        setDevice_name("");
        setDescription_device("");
        setDevice_category("");
        setDevice_cost("");
        setDevice_status("");
        setDevice_comments("");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const onSearchDeviceClick = async () => {
    if (!Device_id) {
      alert("Por favor, ingrese un ID del libro");
      return;
    }
    try {
      // Verificar si el dispositivo existe
      const Device_idExistsResponse = await fetch(
        `http://${config.hostname}:${
          config.port
        }/api/verificarDevice_id?Device_id=${parseInt(Device_id)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (Device_idExistsResponse.status === 200) {
        // Si el dispositivo existe, obtener sus datos
        const DeviceDataResponse = await fetch(
          `http://${config.hostname}:${
            config.port
          }/api/obtenerLibroPorId?Device_id=${parseInt(Device_id)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (DeviceDataResponse.status === 200) {
          const deviceData = await DeviceDataResponse.json();
          setFoundDevice(deviceData);
        } else {
          alert("Error al obtener datos del dispositivo");
          setFoundDevice(null);
        }
      } else {
        alert("ID de libro no encontrado");
        setFoundDevice(null);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const onDeleteDeviceClick = async () => {
    if (!Device_id) {
      alert("Por favor, ingrese un id de libro");
      return;
    }
    try {
      // Verificar si el dispositivo existe
      const Device_idExistsResponse = await fetch(
        `http://${config.hostname}:${
          config.port
        }/api/verificarDevice_id?Device_id=${parseInt(Device_id)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (Device_idExistsResponse.status === 200) {
        const DeviceDataDelete = await fetch(
          `http://${config.hostname}:${config.port}/api/eliminarDevicePorId?Device_id=${Device_id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (DeviceDataDelete.status === 200) {
          alert("libro eliminado");
          setDevice_id("");
          setDevice_name("");
          setDescription_device("");
          setDevice_category("");
          setDevice_cost("");
          setDevice_status("");
          setDevice_comments("");
        } 
      }
      else {
        alert("id libro no encontrado");
        setFoundDevice(null);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const onUpdateLibroClick = async () => {
    if (
      !Device_id ||
      !Device_name ||
      !Description_device ||
      !Device_category ||
      !Device_cost ||
      !Device_status
    ) {
      // Validar que todos los campos estén llenos
      alert("Por favor, complete todos los campos.");
      return;
    }

    try {
      const Device_idExistsResponse = await fetch(
        `http://${config.hostname}:${config.port}/api/verificarDevice_id?Device_id=${Device_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(Device_idExistsResponse); // 200
      if (Device_idExistsResponse.status === 200) {
        const DeviceDataUpdate = await fetch(
          `http://${config.hostname}:${config.port}/api/editarDevicePorId`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              New_Device_id: Device_id, // Nuevo valor para Device_id
              Device_name,
              Description_device,
              Device_category,
              Device_cost,
              Device_status,
              Device_comments,
            }),
          }
        );

        if (DeviceDataUpdate.status === 200) {
          alert("Dispositivo editado exitosamente");
          setDevice_id("");
          setDevice_name("");
          setDescription_device("");
          setDevice_category("");
          setDevice_cost("");
          setDevice_status("");
          setDevice_comments("");
        } else {
          alert("Id de dispositivo no encontrado");
          setFoundDevice(null);
        }
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
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
  //---------------------------------------------------------------------------------------------------------------------------------
  //PRESTAMOS

  const [Loan_ID, setLoan_ID] = useState(""); 
  const [User_ID, setUser_ID] = useState(""); 
  const [Loan_Date, setLoan_Date] = useState(""); 
  const [Expected_Return_Date, setExpected_Return_Date] = useState(""); 
  const [Loan_Status, setLoan_Status] = useState(""); 
  const [Loan_Comments, setLoan_Comments] = useState("");
  const [Physical_Condition_Before, setPhysical_Condition_Before] = useState("");
  const [Physical_Condition_After, setPhysical_Condition_After] = useState("");
  const [Actual_Return_Date, setActual_Return_Date] = useState("");

  const [foundLoan, setFoundLoan] = useState(null);

  const onLoan_IDChange = (e) => {
    setLoan_ID(e.target.value);
  };
  const onUser_IDChange = (e) => {
    setUser_ID(e.target.value);
  };

  const onLoan_DateChange = (e) => {
    setLoan_Date(e.target.value);
  };
  const onActual_Return_DateChange = (e) => {
    setActual_Return_Date(e.target.value);
  };

  const onExpected_Return_DateChange = (e) => {
    setExpected_Return_Date(e.target.value);
  };

  const onLoan_StatusChange = (e) => {
    setLoan_Status(e.target.value);
  };
  const onLoan_CommentsChange = (e) => {
    setLoan_Comments(e.target.value);
  };
  const onPhysical_Condition_BeforeChange = (e) => {
    setPhysical_Condition_Before(e.target.value);
  };
  const onPhysical_Condition_AfterChange = (e) => {
    setPhysical_Condition_After(e.target.value);
  };

  useEffect(() => {
    loadLoanFields(); // Cargar los campos de entrada cuando foundLoan se actualice
  }, [foundLoan]);

  const loadLoanFields = () => {
    setLoan_ID(foundLoan ? foundLoan.Loan_ID : "");
    setUser_ID(foundLoan ? foundLoan.User_ID : "");
    setDevice_id(foundLoan ? foundLoan.Device_id : "");
    setLoan_Date(foundLoan ? foundLoan.Loan_Date : "");
    setExpected_Return_Date(foundLoan ? foundLoan.Expected_Return_Date : "");
    setLoan_Status(foundLoan ? foundLoan.Loan_Status : "");
    setLoan_Comments(foundLoan ? foundLoan.Loan_Comments : "");
    setPhysical_Condition_Before(foundLoan ? foundLoan.Physical_Condition_Before : "");
    setPhysical_Condition_After(foundLoan ? foundLoan.Physical_Condition_After : ""); 
    setActual_Return_Date(foundLoan ? foundLoan.Actual_Return_Date : "");
  };

  const onRegistroLoanClick = async () => {
    if (
      !Loan_ID ||
      !User_ID ||
      !Device_id ||
      !Loan_Date ||
      !Expected_Return_Date ||
      !Loan_Status ||
      !Physical_Condition_Before
     
    ) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const loanDate = new Date(Loan_Date);
    const expectedReturnDate = new Date(Expected_Return_Date);
    const actualReturnDate = new Date(Actual_Return_Date);
  
    // Validar que Loan_Date sea anterior a Expected_Return_Date
    if (loanDate >= expectedReturnDate) {
      alert("La fecha de préstamo debe ser anterior a la fecha esperada devolucion.");
      return;
    }
  
    // Validar que Actual_Return_Date sea igual o posterior a Expected_Return_Date
    if (actualReturnDate < expectedReturnDate) {
      alert("La fecha real devolucion debe ser igual o posterior a la fecha de devolución esperada.");
      return;
    }

      // Verificar si el prestamo ya está registrado
      const existingLoan = await fetch(
        `http://${config.hostname}:${config.port}/api/verificarLoan_ID`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Loan_ID: parseInt(Loan_ID) }),
        }
      );

      if (existingLoan.status === 200) {
        alert("Id prestamo registrado anteriormente ");
        return;
      }

    try {
      const loanData = {
        Loan_ID: parseInt(Loan_ID),
        User_ID: parseInt(User_ID),
        Device_id: parseInt(Device_id),
        Loan_Date: new Date(Loan_Date),
        Expected_Return_Date: new Date(Expected_Return_Date),
        Loan_Status,
        Actual_Return_Date: new Date(Actual_Return_Date),
        Physical_Condition_Before,
        Physical_Condition_After,
        Loan_Comments
      };

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
        setLoan_ID("");
        setUser_ID("");
        setDevice_id("");
        setLoan_Date("");
        setExpected_Return_Date("");
        setLoan_Status("");
        setLoan_Comments("");
        setPhysical_Condition_Before("");
        setPhysical_Condition_After("");
        setActual_Return_Date("");
      } else {
        console.error("Error al registrar prestamo registro");
        alert("Se produjo un error en el registro.");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };


  const onDeleteLoanClick = async () => {
    if (!Loan_ID) {
      alert("Por favor, ingrese un id de prestamo");
      return;
    }
    try {
       const existingLoan = await fetch(`http://${config.hostname}:${config.port}/api/verificarLoan_ID`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Loan_ID: parseInt(Loan_ID) }),
      }
    );

    if (existingLoan.status === 200) {
      const LoanDataDelete = await fetch(
        `http://${config.hostname}:${config.port}/api/eliminarLoanPorLoan_ID?Loan_ID=${Loan_ID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (LoanDataDelete.status === 200) {
        alert("prestamo eliminado correctamente");
        setLoan_ID("");
        setUser_ID("");
        setDevice_id("");
        setLoan_Date("");
        setExpected_Return_Date("");
        setLoan_Status("");
        setLoan_Comments("");
        setPhysical_Condition_Before("");
        setPhysical_Condition_After("");
        setActual_Return_Date("");
      } 
    }else{
      alert("id prestamo no encontrado");
      setFoundDevice(null);
    }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const onSearchLoanClick = async () => {
    if (!Loan_ID) {
      alert("Por favor, ingrese un Id de prestamo");
      return;
    }
    try {
      const Loan_IDExistsResponse = await fetch(
        `http://${config.hostname}:${config.port}/api/verificarLoan_ID`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Loan_ID }),
        }
      );

      if (Loan_IDExistsResponse.status === 200) {
        const LoanDataResponse = await fetch(
          `http://${config.hostname}:${config.port}/api/obtenerUsuarioPorLoan_ID?Loan_ID=${Loan_ID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (LoanDataResponse.status === 200) {
          const userData = await LoanDataResponse.json();
          setFoundLoan(userData);
        }
      } else {
        alert("Id de prestamo no encontrado");
        setFoundLoan(null);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const onUpdateLoanClick = async () => {
    if (
      !Loan_ID ||
      !User_ID ||
      !Device_id ||
      !Loan_Date ||
      !Expected_Return_Date ||
      !Loan_Status ||
      !Loan_Comments ||
      !Physical_Condition_Before ||
      !Physical_Condition_After
    ) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    try {
      const Loan_IDdExistsResponse = await fetch(
        `http://${config.hostname}:${config.port}/api/verificarLoan_ID`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Loan_ID }),
        }
      );

      if (Loan_IDdExistsResponse.status === 200) {
        const LoanDataUpdate = await fetch(
          `http://${config.hostname}:${config.port}/api/editarUsuarioPorLoan_ID?Loan_ID=${Loan_ID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Loan_ID,
              User_ID,
              Device_id,
              Loan_Date,
              Expected_Return_Date,
              Loan_Status,
              Actual_Return_Date,
              Physical_Condition_Before,
              Physical_Condition_After,
            }),
          }
        );

        if (LoanDataUpdate.status === 200) {
          alert("prestamo editado exitosamente");
          setLoan_ID("");
          setUser_ID("");
          setDevice_id("");
          setLoan_Date("");
          setExpected_Return_Date("");
          setLoan_Status("");
          setPhysical_Condition_Before("");
          setPhysical_Condition_After("");
        } else {
          alert("Id del prestamo no encontrado");
          setFoundLoan(null);
        }
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  return (
    <>
      <h1
        style={{
          color: "white",
          textAlign: "center",
          fontSize: "50px",
          marginTop: "0px",
        }}
      >
        Worker page
      </h1>

      <Link to={"/"}>
        <button
          id="inscLibro"
          style={{ marginLeft: "10px", borderRadius: "30%" }}
        >
          Salir
        </button>
      </Link>

      <button id="inscLibro" onClick={toggleFormularioLibro}>
        Registro de libros
      </button>

      <button
        id="inscLibro"
        style={{ marginLeft: "50px" }}
        onClick={togglelistadoLibros}
      >
        Listado de Libros
      </button>

      <button
        id="inscLibro"
        style={{ marginLeft: "50px" }}
        onClick={toggleFormularioUsuario}
      >
        Registro de usuarios
      </button>

      <button
        id="inscLibro"
        style={{ marginLeft: "50px" }}
        onClick={toggleFormularioPrestamos}
      >
        prestamos
      </button>

      {formularioLibroVisible && (
        <div id="formRegisDevices">
          <h1 style={{ marginBottom: "-3px", marginTop: "0px" }}>Libros</h1>
          <div id="register" style={{ display: "flex", alignItems: "center" }}>
            <label id="one" htmlFor="Device_id">
              Id:{" "}
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
            <label id="one" htmlFor="Device_name">
              Nombre:{" "}
            </label>
            &nbsp;&nbsp;
            <input
              type="text"
              id="Device_name"
              name="Device_name"
              onChange={onDevice_nameChange}
              value={Device_name}
            />
          </div>
          <div id="register" style={{ display: "flex", alignItems: "center" }}>
            <label id="one" htmlFor="Description_device">
              Descripcion:{" "}
            </label>
            &nbsp;&nbsp;
            <textarea
              style={{ minHeight: "70px" }}
              type="text"
              id="Description_device"
              name="Description_device"
              onChange={onDescription_deviceChange}
              value={Description_device}
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
              onChange={onDevice_categoryChange}
              value={Device_category}
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
              onChange={onDevice_costChange}
              value={Device_cost}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label id="one" htmlFor="Device_status">
              Estado:{" "}
            </label>
            &nbsp;&nbsp;
            <select
              id="Device_status"
              name="Device_status"
              onChange={onDevice_statusChange}
              value={Device_status}
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
              onChange={onDevice_commentsChange}
              value={Device_comments}
            />
          </div>
          <h4>Buscar o eliminar libro por el Id, el Id no es editable</h4>
          &nbsp;&nbsp;&nbsp;
          <button id="registro_adm" onClick={onRegistroDeviceClick}>
            Registrar libro
          </button>
          &nbsp;&nbsp;
          <button id="registro_adm" onClick={onSearchDeviceClick}>
            Buscar libro
          </button>
          <button
            id="btnUpdate"
            onClick={onUpdateLibroClick}
            style={{ marginLeft: "13px" }}
          >
            Editar libro
          </button>
          <button
            id="registro_adm"
            onClick={onDeleteDeviceClick}
            style={{ marginLeft: "13px" }}
          >
            Eliminar libro
          </button>
        </div>
      )}

      {listadoLibrosVisible && (
        <div id="bookList">
          <>
            <h1>Lista de libros</h1>
            <button
              onClick={onShowTableclick}
              style={{ marginBottom: "10px", fontSize: "30px" }}
            >
              Refrescar tabla
            </button>
            <table>
              <thead>
                <tr>
                  <th>ID del Dispositivo</th>
                  <th>Nombre del Dispositivo</th>
                  <th>Descripción</th>
                  <th>Categoría</th>
                  <th>Costo</th>
                  <th>Estado del Dispositivo</th>
                  <th>Comentarios</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device._id}>
                    <td>{device.Device_id}</td>
                    <td>{device.Device_name}</td>
                    <td>{device.Description_device}</td>
                    <td>{device.Device_category}</td>
                    <td>{device.Device_cost}</td>
                    <td>{device.Device_status}</td>
                    <td>{device.Device_comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        </div>
      )}

      {formularioUsuarioVisible && (
        <div id="formRegisUsers">
          <h1 style={{ marginBottom: "-3px", marginTop: "0px" }}>Usuarios</h1>
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
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <button id="registro_adm" onClick={onRegistroClick}>
            Registrar
          </button>
        </div>
      )}

      {formularioPrestamosVisible && (
        <div id="formRegisLoans">

          <h1>Prestamos</h1>

          <div id="register" style={{ display: "flex", alignItems: "center" }}>
            <label id="one" htmlFor="Loan_ID" style={{ width: "70%" }}>
              Id del prestamo:{" "}
            </label>
            &nbsp;&nbsp;
            <input
              type="text"
              id="Loan_ID"
              name="Loan_ID"
              onChange={onLoan_IDChange}
              value={Loan_ID}
            />
          </div>

          <div id="register" style={{ display: "flex", alignItems: "center" }}>
            <label id="one" htmlFor="User_ID" style={{ width: "70%" }}>
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
            &nbsp;&nbsp;
          </div>

          <div id="register" style={{ display: "flex", alignItems: "center" }}>
            <label id="one" htmlFor="Device_id" style={{ width: "70%" }}>
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

          <div id="register" style={{ display: "flex", alignItems: "center" }}>
            <label id="one" htmlFor="Loan_Date" style={{ width: "100%" }}>
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

          <div id="register" style={{ display: "flex", alignItems: "center" }}>
            <label
              id="one"
              htmlFor="Expected_Return_Date"
              style={{ width: "100%" }}
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

          <div style={{ display: "flex", alignItems: "center" }}>
            <label id="one" htmlFor="Loan_Status" style={{ width: "100%" }}>
              Estado del prestamo:{" "}
            </label>
            &nbsp;&nbsp;
            <select
              id="Loan_Status"
              name="Loan_Status"
              onChange={onLoan_StatusChange}
              value={Loan_Status}
            >
              <option value="">Estado prestamo</option>
              <option value="pendiente">pendiente</option>
              <option value="entregado">entregado</option>
            </select>
          </div>

          <div id="register" style={{ display: "flex", alignItems: "center" }}>
            <label id="one" htmlFor="Loan_Comments">
              Comentario:{" "}
            </label>
            &nbsp;&nbsp;
            <textarea
              type="text"
              id="Loan_Comments"
              name="Loan_Comments"
              onChange={onLoan_CommentsChange}
              value={Loan_Comments}
            />

          </div>
          &nbsp;&nbsp;

          <div style={{ display: "flex", alignItems: "center" }}>
            <label id="one" htmlFor="Physical_Condition_Before" style={{ width: "100%" }}>
            Estado fisico del libro antes:{" "}
            </label>
            &nbsp;&nbsp;
            <select
              id="Physical_Condition_Before"
              name="Physical_Condition_Before"
              onChange={onPhysical_Condition_BeforeChange}
              value={Physical_Condition_Before}
            >
              <option value="">Seleccione estado</option>
              <option value="Bien">Bien</option>
              <option value="desgastado">desgastado</option>
              <option value="dañado">dañado</option>
            </select>
          </div> &nbsp;&nbsp;
          
          <div style={{ display: "flex", alignItems: "center" }}>
            <label id="one" htmlFor="Physical_Condition_After" style={{ width: "100%" }}>
            Estado  del libro después:{" "}
            </label>
            &nbsp;&nbsp;
            <select
              id="Physical_Condition_After"
              name="Physical_Condition_After"
              onChange={onPhysical_Condition_AfterChange}
              value={Physical_Condition_After}
            >
              <option value="">Seleccione estado</option>
              <option value="Bien">Bien</option>
              <option value="desgastado">desgastado</option>
              <option value="dañado">dañado</option>
            </select>
          </div>

          <div id="register" style={{ display: "flex", alignItems: "center" }}>
            <label
              id="one"
              htmlFor="Actual_Return_Date"
              style={{ width: "100%" }}
            >
              Fecha real devolucion:{" "}
            </label>
            &nbsp;&nbsp;
            <input
              type="date"
              id="Actual_Return_Date"
              name="Actual_Return_Date"
              onChange={onActual_Return_DateChange}
              value={Actual_Return_Date}
            />
          </div>

          <h4>Buscar o eliminar prestamo por el id</h4>

          <button id="registro_adm" onClick={onRegistroLoanClick}>
            Registrar prestamo
          </button>

          <button id="registro_adm" onClick={onSearchLoanClick}>
            Buscar prestamo
          </button>

          <button id="btnUpdate" onClick={onUpdateLoanClick}>
            Editar prestamo
          </button>

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          
          <button id="registro_adm" onClick={onDeleteLoanClick}>
            Eliminar prestamo
          </button>

        </div>
      )}
    </>
  );
}
