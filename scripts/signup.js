window.addEventListener("load", function () {
    /* ---------------------- obtenemos variables globales ---------------------- */
    const form = document.forms[0];
    const nombre = document.querySelector("#inputNombre");
    const apellido = document.querySelector("#inputApellido");
    const email = document.querySelector("#inputEmail");
    const password = document.querySelector("#inputPassword");
    const passwordRepetida = document.querySelector("#inputPasswordRepetida");
    const url = "https://ctd-todo-api.herokuapp.com/v1";
  
    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      mostrarSpinner();
      const payload = {
        firstName: nombre.value,
        lastName: apellido.value,
        email: email.value,
        password: password.value,
      };
  
      const settings = {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      validacion(settings);
    });
    function validacion(s) {
      if (
        validarTexto(nombre.value, apellido.value) &&
        normalizarTexto(nombre.value, apellido.value) &&
        validarEmail(email.value) &&
        normalizarEmail(email.value) &&
        validarContrasenia(password.value) &&
        compararContrasenias(password.value, passwordRepetida.value)
      ) {
        realizarRegister(s);
        form.reset();
      }else{
        ocultarSpinner();
      }
    }
  
    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarRegister(settings) {
      console.log("Lanzando la consulta a la API");
  
      fetch(`${url}/users`, settings)
        .then((response) => {
          console.log(response);
  
          return response.json();
        })
        .then((data) => {
          ocultarSpinner();
          form.classList.remove("hidden")
          const a = document.querySelector("a");
          a.classList.remove("hidden");
          console.log("Promesa cumplida: objeto data: " + data.jwt);
          console.log(data);
          const span = document.querySelector(".campo-form");
          span.innerHTML = `${data}`;
  
          if (data.jwt) {
            //guardo en LocalStorage el objeto con el token
            localStorage.setItem("jwt", JSON.stringify(data.jwt));
  
            //redireccionamos a la página
            location.replace("mis-tareas.html");
          }
          
        })
  
        .catch((err) => {
          console.log("Promesa rechazada:");
          console.log(err);
          ocultarSpinner();
          form.classList.remove("hidden")
        });
    }
  });