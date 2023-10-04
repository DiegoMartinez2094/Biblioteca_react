# ¿Qué es "BOOKGEST"?

BOOKGEST es una aplicacion que facilita a Usuarios el adquirir un servicio de prestamo para libros por otra parte, permite a los trabajadores acceder a una plataforma de registro, editacion, eliminación y busqueda de usuarios, libros y prestamos, en especial el trabajador puede visualizar en tiempo real la informacion de los libros.

En el apartado de inicio, la app permite el registro de usuarios, y el ingreso de los mismo, el sistema redirecciona según el rol del usuario, tenemos tres direcciones: 

Administrador: genera un formulario para el manejo de usuarios con la opcion de agregarle un rol (administrador, usuario, trabajador) 

Trabajador: Formularios para registro, busqueda, eliminacion y modificacion de libros y prestamos, un formulario para solo agregar clientes con el rol de usuario por defecto, un listado de todos los libros 

Usuario: Encontrará un boton para mostrar los libros que estan disponibles para prestar con su titulo, una descripcion corta y el id del libro además de eso, un boton de prestar que al oprimirlo genera un formulario de prestamo.

# Despliegue de la app:

***1. Clonar el Repositorio:*** Clona este repositorio en tu máquina local usando el comando:

```
git clone https://github.com/DiegoMartinez2094/Biblioteca_react.git
```

 ***2. Instalar Dependencias:*** Asegúrate de tener Node.js instalado en este caso se manejó el proyecto en la v18.16.0. Luego, desde la raíz del proyecto, abre la terminal y ejecuta el siguiente comando para instalar las dependencias:

```

npm install
```

***3. Configurar Variables de Entorno:*** Abre el archivo `.env.example` y verifica las variables de entorno necesarias para la conexión al servidor y a la base de datos en Atlas. Asegúrate de proporcionar los valores correctos para `My_server`, `ATLAS_USER`, `ATLAS_PASSWORD` y `ATLAS_DB`. y quita .example que el nombre del archivo sea solo `.env`

***4.Iniciar archivo:*** Ejecutamos la apicacion mediante el siguiente comando en la terminal:

```
npm run start
```

 La terminal nos mostrará la siguiente información:

```
> mi-aplicacion@1.0.0 start
> concurrently "npm run backend" "npm run frontend"

[0] 
[0] > mi-aplicacion@1.0.0 backend
[0] > nodemon --quiet app.js
[0] 
[1] 
[1] > mi-aplicacion@1.0.0 frontend
[1] > vite
[1] 
[1] 
[1]   VITE v4.4.10  ready in 226 ms
[1] 
[1]   ➜  Local:   http://localhost:5174/
[1]   ➜  Network: use --host to expose
[0] Servidor iniciado en http://127.10.10.10:5010
```

esta linea nos muestra cual es el host y el puerto que debemos abrir en nuestro navegador de preferencia Google Chrome

```
  ➜  Local:   http://localhost:5174/
```

# Visualiza la app y su funcionalidad
