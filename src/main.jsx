import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './Components/Home/Home.jsx'
import RegistroForm from './Components/login/registro.jsx'
import SignIn from './Components/Sign-in/Sign-in.jsx'
import UserPag from './Components/UserPag/UserPag.jsx'
import RegistroFormAdm from './Components/RegistroAdm/registroAdm.jsx'
import NotFound from './Components/NotFound/NotFound.jsx'
import WorkerPag from './Components/WorkerPag/WorkerPag.jsx'
import SessionExpired from './Components/sessionExpired/SessionExprired.jsx'

const router =createBrowserRouter([
  {
    path:'/',
    element: <Home/>
  },
  {
    path:'/registro',
    element: <RegistroForm/>
  },
  {
    path:'/ingreso',
    element: <SignIn/>
  },
  {
    path:'/userpag',
    element: <UserPag/>
  },
  {
    path:'/admpag',
    element: <RegistroFormAdm/>
  },
  {
    path: '*',
    element: <NotFound/>,
  },
  {
    path: '/WorkerPag',
    element: <WorkerPag/>,
  },
  {
    path: '/SessionExpired',
    element: <SessionExpired/>,
  }

])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <RouterProvider router={router}/>
  </React.StrictMode>,
)
