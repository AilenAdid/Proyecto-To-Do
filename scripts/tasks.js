// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.
if (!localStorage.jwt) {
  location.replace("./index.html");
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
  const numeroFinalizadas = document.querySelector("#cantidad-finalizadas");

  const token = JSON.parse(localStorage.jwt);

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
        Authorization: token,
      },
    };
    console.log("Consultando mi usuario...");
    fetch(urlUsuario, settings)
      .then((response) => response.json())
      .then((data) => {
        console.log("Nombre de usuario:");
        console.log(data.firstName);
        nombreUsuario.innerText = data.firstName+" "+data.lastName;
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
        Authorization: token,
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

    const tarea = {
      description: nuevaTarea.value,
      completed: false,
    };
    const settings = {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(tarea),
    };

    fetch(urlTareas, settings)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((tarea) => {
        console.log(tarea);
        consultarTareas();
      })
      .catch((error) => console.log(error));
  });

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */
  function renderizarTareas(listado) {
    tareasPendientes.innerHTML = "";
    tareasTerminadas.innerHTML = "";
    let contador = 0;
    numeroFinalizadas.innerHTML = contador;

    listado.forEach((tarea) => {
      //variable intermedia para manipular la fecha
      let fecha = new Date(tarea.createdAt);

      if (tarea.completed) {
        contador++;
        //lo mandamos al listado de tareas completas
        tareasTerminadas.innerHTML += `
        <li class="tarea">
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
        </li>
                      `;
      } else {
        //lo mandamos al listado de tareas sin terminar
        tareasPendientes.innerHTML += `
        <li class="tarea">
          <button class="change" id="${
            tarea.id
          }"><i class="fa-regular fa-circle"></i></button>
          <div class="descripcion">
            <p class="nombre">${tarea.description}</p>
            <p class="timestamp">${fecha.toLocaleDateString()}</p>
            
          </div>
        </li>
                      `;
      }
      //actualizamos el contador en la pantalla
      numeroFinalizadas.innerText = contador;
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */
  function botonesCambioEstado() {
    const btnCambioEstado = document.querySelectorAll(".change");
    btnCambioEstado.forEach((boton) => {
      boton.addEventListener("click", function (event) {
        console.log("cambiando estado de tarea");
        console.log(event);

        const id = event.target.id;
        const url = `${urlTareas}/${id}`;
        const payload = {};

        //segun el tipo de boton clickeado, cambiamos el estado de la tarea

        if (event.target.classList.contains("incompleta")) {
          //si esta completa, la paso a pendiente
          payload.completed = false;
        } else {
          //sino, esta pendiente, la paso a completada
          payload.completed = true;
        }
        const settingsCambio = {
          method: "PUT",
          headers: {
            Authorization: token,
            "Content-type": "application/json",
          },
          body: JSON.stringify(payload),
        };
        fetch(url, settingsCambio).then((response) => {
          console.log(response.status);
          //vuelvo a consultar las tareas actualizadas y pintarlas
          //en pantalla nuevamente
          consultarTareas();
        });
      });
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */
  function botonBorrarTarea() {
    const btnBorrarTarea = document.querySelectorAll(".borrar");
    btnBorrarTarea.forEach((boton) => {
      boton.addEventListener("click", function (event) {
        const id = event.target.id;
        const url = `${urlTareas}/${id}`;

        const settingsCambio = {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        };

        fetch(url, settingsCambio).then((response) => {
          console.log("Borrando tarea ...");
          console.log(response.status);

          //vuelvo a consultar las tareas actualizadas
          consultarTareas();
        });
      });
    });
  }
});