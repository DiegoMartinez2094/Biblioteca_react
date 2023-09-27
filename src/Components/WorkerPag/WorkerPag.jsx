import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./WorkerPag.css";

export default function WorkerPag() {
  const [formularioVisible, setFormularioVisible] = useState(false);

  function toggleFormulario() {
    setFormularioVisible(!formularioVisible);
  }

  return (
    <>
      <h1 style={{ color: "white", textAlign: "center", fontSize: "50px", marginTop: "0px" }}>
        Worker page
      </h1>
      <button id="inscLibro" onClick={toggleFormulario}>
        Registro de libros
      </button>
      {formularioVisible && (
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
    </>
  );
}
