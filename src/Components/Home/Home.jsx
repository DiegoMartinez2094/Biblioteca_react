import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <>
     <h1 id='title'>"BookGest”</h1>
    <div id='divHome'>
      <Link to={"/registroAdm"}>
        <button className='btn' id='btnsHome'>Registro</button>
      </Link>
      <Link to={"/ingreso"}>
        <button className='btn' id='btnsHome'>Ingreso</button>
      </Link>
    </div></>
   
  )
}
