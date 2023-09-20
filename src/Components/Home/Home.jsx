import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
        <> 
        <Link to={"/registroAdm"} > <button>Registro</button></Link>
        <button>Ingreso</button> 
        </>
  )
}
