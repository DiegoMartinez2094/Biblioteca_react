import React from 'react'
import  { useState } from 'react';
import { Link } from 'react-router-dom'

export default function SignIn() {
  
    const [Password, setPassword] = useState('');
    const [Email, setEmail] = useState('');

    const onPasswordChange = (e) => {
        setPassword(e.target.value);
      };
      const onEmailChange = (e) => {
        setEmail(e.target.value);
      };
      
      const onRegistroClick = async () => {
      
        if ( !Password || !Email ) {    // Validar que todos los campos estén llenos
          alert('Por favor, complete todos los campos.');
          return;
        } }

  return (
    <>
     <div id='register'>
      <div id='register'>
        <label id='one' htmlFor="Password">Contraseña: </label>
        <input
          type="password"
          id="Password"
          name="Password"
          onChange={onPasswordChange}
          value={Password}
        />
      </div>
      <div id='register'>
        <label id='one' htmlFor="Email">Correo electrónico: </label>
        <input 
          type="text"
          id="Email"
          name="Email"
          onChange={onEmailChange}
          value={Email}
        />
      </div>
      <Link to={"/"} ><button id='registro_adm'>Inicio</button></Link>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <button id='registro_adm' onClick={onRegistroClick}>Ingresar</button> 
     
    </div>
    </>
 
  )
}
