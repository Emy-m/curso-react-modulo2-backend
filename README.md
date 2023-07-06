# Movie Management App

Esta es una aplicación para administrar una lista de películas, con la capacidad de agregar, eliminar y mostrar películas junto con su información.

## Instalación

1. Clona este repositorio en tu máquina local.

   ```shell
    git clone https://gitlab.com/Emy_m/express-backend.git
   ```

2. Navega al directorio del proyecto.

   ```shell
    cd curso-react-modulo2-backend
   ```

3. Instala las dependencias requeridas.

   ```shell
    npm install
   ```

4. Inicia la aplicación.

   ```shell
    npm start
   ```

   Tambien puedes usar

   ```shell
    node app.js
   ```

   Esto iniciará el servidor local en el puerto 3000. Puedes acceder al mismo en [http://localhost:3000](http://localhost:3000).

   En la url [http://localhost:3000](http://localhost:3000) no hay nada, Interactúa con la aplicación utilizando los siguientes endpoints:

   - GET /movies: Obtiene una lista de todas las películas disponibles.

   - GET /movies/:id Obtiene los detalles de una película específica según su ID.
   - POST /movies Agrega una nueva película a la lista. Debes proporcionar los siguientes datos en el cuerpo de la solicitud:
     - **title**: Título de la película.
     - **genre**: Género de la película.
     - **year**: Año de lanzamiento de la película.
     - **image**: Archivo de imagen de la película (formato PNG solamente).
   - PATCH /movies Edita una película existente. Debes proporcionar los siguientes datos en el cuerpo de la solicitud:
     - **id**: ID de la película a editar.
     - **title**: Título de la película.
     - **genre**: Género de la película.
     - **year**: Año de lanzamiento de la película.
     - **image**: Archivo de imagen de la película (formato PNG solamente).
   - DELETE /movies/:id Elimina una película de la lista según su ID.
   - GET /genres Obtiene una lista de todos los géneros disponibles.
   - GET /images/:name Obtiene una imagen específica según su nombre.
   - POST /images Agrega una nueva imagen a la lista. Debes proporcionar los siguientes datos en el cuerpo de la solicitud:
     - **image**: Archivo de imagen (formato PNG solamente). La imagen debe enviarse en el campo **image** dentro de un formulario.
