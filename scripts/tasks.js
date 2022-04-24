// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.
const token = localStorage.getItem('jwt');

if (!token) {
  location.replace('./index.html')
}
/* ------ comienzan las funcionalidades una vez que carga el documento ------ */
window.addEventListener("load", function () {
    /* ---------------- variables globales y llamado a funciones ---------------- */
    const urlTareas = "https://ctd-todo-api.herokuapp.com/v1/tasks";
    const urlUsuario = "https://ctd-todo-api.herokuapp.com/v1/users/getMe";  
    const formCrearTarea = document.querySelector(".nueva-tarea");
    const nuevaTarea = document.querySelector("#nuevaTarea");
    const btnCerrarSesion = document.querySelector("#closeApp");
    const nombreUsuario = document.querySelector(".user-info p");
    const tareasPendientes = document.querySelector(".tareas-pendientes");
    const tareasTerminadas = document.querySelector(".tareas-terminadas");
    const cantidadFinalizadas = document.querySelector("#cantidad-finalizadas");
    const btnCambioEstado = document.querySelectorAll(".change");
    const btnBorrarTarea = document.querySelectorAll(".borrar");
    obtenerNombreUsuario();
    consultarTareas();
  
    /* -------------------------------------------------------------------------- */
    /*                          FUNCIÓN 1 - Cerrar sesión                         */
    /* -------------------------------------------------------------------------- */
  
    btnCerrarSesion.addEventListener("click", function () {
      const cerrarSesion = confirm("¿Desea cerrar sesión?");
      if (cerrarSesion) {
        //limpiamos el localstorage y redireccioamos a login
        localStorage.clear();
        location.replace("./index.html");
      }
    });
  
    /* -------------------------------------------------------------------------- */
    /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
    /* -------------------------------------------------------------------------- */
  
    function obtenerNombreUsuario() {
      const settings = {
        method: "GET",
        headers: {
          authorization: token,
        },
      };
      console.log("Consultando mi usuario...");
      fetch(urlUsuario, settings)
        .then((response) => response.json())
        .then((data) => {
          console.log("Nombre de usuario:");
          console.log(data.firstName);
          
          nombreUsuario.innerText = data.firstName;
        })
        .catch((error) => console.log(error));
    }
  
    /* -------------------------------------------------------------------------- */
    /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
    /* -------------------------------------------------------------------------- */
  
    function consultarTareas() {
      const settings = {
        method: "GET",
        headers: {
          authorization: token,
        },
      };
      console.log("Consultando mis tareas...");
      fetch(urlTareas, settings)
        .then((response) => response.json())
        .then((tareas) => {
          console.log("Tareas del usuario");
          console.table(tareas);
  
          renderizarTareas(tareas);
          botonesCambioEstado();
          botonBorrarTarea();
        })
        .catch((error) => console.log(error));
    }
  
    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
    /* -------------------------------------------------------------------------- */
  
    formCrearTarea.addEventListener("submit", function (event) {
      event.preventDefault();
      console.log("creando tarea...");
  
      const tarea = JSON.stringify(nuevaTarea.value);
      const settings = {
        method: "POST",
        mode: 'no-cors',
        headers: {
          authorization: token,
          "Content-type": "application/json; charset=UTF-8",
          
        },
        body: {
          "description": tarea,
          "completed": false
        },
      };
      fetch(urlTareas, settings)
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(tarea => console.log(tarea))
        .catch((error) => console.log(error));
  
      //renderizarTareas();
    });
  
    /* -------------------------------------------------------------------------- */
    /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
    /* -------------------------------------------------------------------------- */
    function renderizarTareas(listado) {
        tareasPendientes.innerHTML = "";
        tareasTerminadas.innerHTML = "";
        let contador = 0;
        cantidadFinalizadas.innerHTML = contador;

        listado.forEach(tarea => {
            //variable intermedia para manipular la fecha
            let fecha = new Date(tarea.createdAt);

            if(tarea.completed) {
                contador++;
                //lo mandamos al listado de tareas completas
                tareasTerminadas.innerHTML+= `<li class="tarea">
                <div class="hecha">
                  <i class="fa-regular fa-circle-check"></i>
                </div>
                <div class="descripcion">
                  <p class="nombre">${tarea.description}</p>
                  <div class="cambios-estados">
                    <button class="change incompleta" id="${tarea.id}" ><i class="fa-solid fa-rotate-left"></i></button>
                    <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
                  </div>
                </div>
              </li>`
            } else {
                //lo mandamos al listado de tareas sin terminar
                tareasPendientes.innerHTML+=`<li class="tarea">
                <button class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
                <div class="descripcion">
                  <p class="nombre">${tarea.description}</p>
                  <p class="timestamp">${fecha.toLocaleDateString()}</p>
                </div>
              </li>`
            }
            //actualiamos el contador en la pantalla
            cantidadFinalizadas.innerText = contador;
        });
        




    }
  
    /* -------------------------------------------------------------------------- */
    /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
    /* -------------------------------------------------------------------------- */
    function botonesCambioEstado() {

        btnCambioEstado.forEach(boton => {
            boton.addEventListener("click", function (event){
                console.log("Cambiando estado de tarea...")
                console(event);

                const id = event.target.id;
                const url = `${urlTareas}/${id}`;
                const payload = {};
                //segun el tipo de boton que fue clickeado cambia el estado
                if(event.target.classList.contains("incompleta")){
                        //si esta completada la paso a pendiente
                        payload.completed = false;
                } else {
                    payload.completed = true;
                }

                const settingsCambio = {
                    method: "PUT",
                    headers : {
                        "Authorization": JSON.parse(token),
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
                fetch(url, settingsCambio)
                    .then(response => {
                        console.log(response.status);
                        consultarTareas();
                    })
            })
        });

    }
  
    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
    /* -------------------------------------------------------------------------- */
    function botonBorrarTarea() {
        btnBorrarTarea.forEach(boton => {
            boton.addEventListener("click", function(event){
                const id = event.target.id;
                const url = `${urlTareas}/${id}`
                
                const settingsCambio = {
                    method: "DELETE",
                    headers: {
                        "Authorization": JSON.parse(token),
                    }
                }
                fetch(url, settingsCambio)
                    .then(response => {
                        console.log("Borrando tarea...");
                        console.log(response.status);
                        //vuelvo a consultar las tareas actualizadas
                        consultarTareas();
                    })
            })
        })
    }
  });
  