import React from 'react'
import { Link } from "react-router-dom";
import './NotFound.css'

export default function NotFound() {
  return (
    <> <div> <img src="../../../public/error404.png" id='IMGerror404' alt="Texto alternativo de la imagen" div/></div>

      <Link to={"/"}>
      <button id='btnInicio' >INICIO</button>
    </Link>
    </>
   
  )
}
