import { useState } from 'react';
import { Link } from 'react-router-dom'

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
  
    const numericValue = parseInt(e.target.value);  // Intentar convertir el valor de User_id en un número
    if (!isNaN(numericValue)) { // Verificar si la conversión fue exitosa
      setUser_id(numericValue); // Almacena el valor como número
    } else {
      setUser_id(''); // Establece el valor como cadena vacía si no es un número válido
    }
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
    if (isNaN(User_id)) {  // Validar que User_id sea un número
      alert('El ID debe ser un número.');
      return;
    }
    if (!User_id || !User_name || !Password || !Email || !Phone || !Address || !Role) {    // Validar que todos los campos estén llenos
      alert('Por favor, complete todos los campos.');
      return;
    }

  
    try {
      // Verificar si el correo electrónico ya está registrado
      const emailExistsResponse = await fetch('http://127.10.10.10:5000/api/verificarEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email }),
      });
  
      if (emailExistsResponse.status === 200) {
        // El correo electrónico ya está registrado
        alert('Credenciales registradas anteriormente');
        return;
      }
  
      // Continuar con el registro si el correo electrónico no existe
      const response = await fetch('http://127.10.10.10:5000/api/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ User_id, User_name, Password, Email, Phone, Address, Role }),
      });
  
      if (response.status === 201) {
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
        alert('Se produjo un error en el registro.');
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
    <div id='register'>
        <div id='register'>
        <label id='one' htmlFor="User_id">Id del usuario: </label>
        <input
          type="text"
          id="User_id"
          name="User_id"
          onChange={onUser_idChange}
          value={User_id}
        />
      </div>
      <div id='register'>
        <label id='one' htmlFor="User_name">Nombre del usuario: </label>
        <input
          type="text"
          id="User_name"
          name="User_name"
          onChange={onUser_nameChange}
          value={User_name}
        />
      </div>
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
     
      <div id='register'>
        <label id='one' htmlFor="Phone">Telefono del usuario: </label>
        <input
          type="text"
          id="Phone"
          name="Phone"
          onChange={onPhoneChange}
          value={Phone}
        />
       
      </div>
      <div id='register'>
        <label id='one' htmlFor="Address">Direccion del usuario: </label>
        <input
          type="text"
          id="Address"
          name="Address"
          onChange={onAddressChange}
          value={Address}
        />
      
      </div>
      <div>
        <label id='one' htmlFor="Role">Rol del usuario: </label>
        <select
  id="Role"
  name="Role"
  onChange={onRoleChange}
  value={Role}
>
  <option value="">Seleccione el rol</option>
  <option value="administrador">Administrador</option>
  <option value="trabajador">Trabajador</option>
  <option value="usuario">Usuario</option>
</select>
        <br/><br/>
      </div>
      <Link to={"/"} ><button id='registro_adm'>Inicio</button></Link>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <button id='registro_adm' onClick={onRegistroClick}>Registrar</button> 
     
    </div>
  );
}
