import React from 'react'
import { Link } from "react-router-dom";
import './NotFound.css'
import ImgError404 from '../../../public/Error404.png'

export default function NotFound() {
  return (
    <> <div> <img src={ImgError404} id='IMGerror404' alt="Texto alternativo de la imagen" div/></div>

      <Link to={"/"}>
      <button id='btnInicio' >INICIO</button>
    </Link>
    </>
   
  )
}
