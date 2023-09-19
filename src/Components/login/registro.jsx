import React, { useState } from 'react';

import './registro.css';

//["User_id", "User_name", "Password","Email","Phone","Address","Role"]

export default function RegistroForm() {
  const[User_id, setUser_id]= useState('');
  const[User_name, setUser_name]= useState('')
  const [Password, setPassword] = useState('');
  const [Email, setEmail] = useState('');
  const [Phone, setPhone] = useState('');
  const [Address, setAddress] = useState('');
  const [Role, setRole] = useState('');

  const onUser_idChange = (e) => {
    setUser_id(e.target.value);
  };
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
  const onRoleChange = (e) => {
    setRole(e.target.value);
  };


  const onRegistroClick = async () => {
    try {
      const response = await fetch('http://127.10.10.10:5000/api/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ User_id, User_name, Password, Email, Phone, Address, Role   }),
      });

      if (response.status === 201) {
        // Registro exitoso, puedes redirigir o mostrar un mensaje de éxito
        console.log('Usuario registrado correctamente');
        alert('Usuario registrado correctamente');

        // Limpiar los campos después del registro exitoso
        setUser_id('');
        setUser_name('');
        setEmail('');
        setPassword('');
        setPhone('');
        setAddress('');
        setRole('');
       
      } else {
        // Manejar errores aquí
        console.error('Error al registrar usuario registro.jsx');
        alert('credenciales registradas anteriormente');
        setUser_id('');
        setUser_name('');
        setEmail('');
        setPassword('');
        setPhone('');
        setAddress('');
        setRole('');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  return (
    <div>
        <div>
        <label htmlFor="User_id">Id del Usuario: </label>
        <input
          type="text"
          id="User_id"
          name="User_id"
          onChange={onUser_idChange}
          value={User_id}
        />
        <br/><br/>
      </div>
      <div>
        <label htmlFor="User_name">Nombre del Usuario: </label>
        <input
          type="text"
          id="User_name"
          name="User_name"
          onChange={onUser_nameChange}
          value={User_name}
        />
        <br/><br/>
      </div>
      <div>
        <label htmlFor="Password">Contraseña: </label>
        <input
          type="password"
          id="Password"
          name="Password"
          onChange={onPasswordChange}
          value={Password}
        />
        <br/><br/>
      </div>
      <div>
        <label htmlFor="Email">Correo Electrónico: </label>
        <input 
          type="text"
          id="Email"
          name="Email"
          onChange={onEmailChange}
          value={Email}
        />
        <br/><br/>
      </div>
     
      <div>
        <label htmlFor="Phone">Telefono del usuario: </label>
        <input
          type="text"
          id="Phone"
          name="Phone"
          onChange={onPhoneChange}
          value={Phone}
        />
        <br/><br/>
      </div>
      <div>
        <label htmlFor="Address">Direccion del usuario: </label>
        <input
          type="text"
          id="Address"
          name="Address"
          onChange={onAddressChange}
          value={Address}
        />
        <br/><br/>
      </div>
      <div>
        <label htmlFor="Role">Rol del usuario: </label>
        <input
          type="text"
          id="Role"
          name="Role"
          onChange={onRoleChange}
          value={Role}
        />
        <br/><br/>
      </div>
      <button onClick={onRegistroClick}>Registrar</button>
    </div>
  );
}
