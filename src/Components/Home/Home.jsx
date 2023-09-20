import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
        <> 
        <Link to={"/registroAdm"}><button id='registro_adm'>Registro</button></Link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Link to={"/ingreso"}><button id='registro_adm'>Ingreso</button> </Link>
     
        </>
  )
}
