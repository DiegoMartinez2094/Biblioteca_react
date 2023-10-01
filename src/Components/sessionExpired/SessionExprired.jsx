import React from "react";
import { Link } from "react-router-dom";

export default function SessionExpired() {
  return (
    <>
    <h1 style={{ color: "white", fontSize: "100px", backgroundColor: "black" }}>Tiempo de sesión expirado</h1>
      <h5 style={{ color: "white", fontSize: "50px", backgroundColor: "black" }} >por su seguridad hemos finalizado tu sesion por inactividad</h5>
      <Link to={"/ingreso"}>
        <h2 style={{ color: "white", fontSize: "50px", backgroundColor: "black" }}>click aqui para iniciar sesion</h2>
        </Link>
    </>
  );
}
