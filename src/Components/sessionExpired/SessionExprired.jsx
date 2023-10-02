import React from "react";
import { Link } from "react-router-dom";

export default function SessionExpired() {
  return (
    <>
      <Link to={"/ingreso"}>
        <h2 style={{ color: "white", fontSize: "50px", backgroundColor: "black" }}>click aqui para iniciar sesion</h2>
        </Link>
    </>
  );
}
