import React, { useEffect, useState } from 'react';
import './UserPag.css';

export default function UserPag() {
  // Estado para almacenar el nombre de usuario
  const [userName, setUserName] = useState('');

  // Función para analizar las cookies y obtener el nombre de usuario
  const getUserNameFromCookie = () => {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'nombre de usuario') {
        return decodeURIComponent(value);
      }
    }
    return '';
  };

  // Cuando el componente se monta, obtén el nombre de usuario de la cookie
  useEffect(() => {
    const nameFromCookie = getUserNameFromCookie();
    setUserName(nameFromCookie);
  }, []);

  return (
    <div>
      <h1 id='holausuario'>Hola, {userName}</h1>
    </div>
  );
}
