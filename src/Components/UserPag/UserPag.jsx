import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate desde React Router
import './UserPag.css';

export default function UserPag() {
  // Estado para almacenar el nombre de usuario
  const [userName, setUserName] = useState('');

  // Función para analizar las cookies y obtener el nombre de usuario
  const getUserNameFromCookie = () => {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'User_name') {
        return decodeURIComponent(value);
      }
    }
    return '';
  };

  // Función para verificar si la cookie ha caducado
  const isCookieActive = () => {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      if (name === 'User_name') {
        // Verificar si la cookie está vacía o no
        return !!value; // Devuelve true si la cookie tiene un valor
      }
    }
    return false; // La cookie no está presente
  };

  // Obtiene la función de navegación desde React Router
  const navigate = useNavigate();

  // Cuando el componente se monta y en cada renderizado, obtén el nombre de usuario de la cookie y verifica la cookie
  useEffect(() => {
    const nameFromCookie = getUserNameFromCookie();
    setUserName(nameFromCookie);

    // Verificar si la cookie ha caducado y redirigir al componente SessionExpired
    if (!isCookieActive()) {
      navigate('/SessionExpired'); // Redirige al componente SessionExpired
    }
  }, [navigate]);

  return (
    <div>
      <h1 id='holausuario'>Hola, {userName}</h1>
    </div>
  );
}
