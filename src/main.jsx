import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './Components/Home/Home.jsx'
import RegistroForm from './Components/login/registro.jsx'
import SignIn from './Components/Sign-in/Sign-in.jsx'

const router =createBrowserRouter([
  {
    path:'/',
    element: <Home/>
  },
  {
    path:'/registroAdm',
    element: <RegistroForm/>
  },
  {
    path:'/ingreso',
    element: <SignIn/>
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <RouterProvider router={router}/>
  </React.StrictMode>,
)
