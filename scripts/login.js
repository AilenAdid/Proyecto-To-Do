window.addEventListener("load", function () {
  /* ---------------------- obtenemos variables globales ---------------------- */
  const formLogin = document.forms[0];
  const inputEmail = document.getElementById("inputEmail");
  const inputPass = document.getElementById("inputPassword");
  const url = "https://ctd-todo-api.herokuapp.com/v1/users/login";

  /* -------------------------------------------------------------------------- */
  /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
  /* -------------------------------------------------------------------------- */
  formLogin.addEventListener("submit", (event) => {
    event.preventDefault();

    mostrarSpinner();

    const usuario = {
      email: inputEmail.value,
      password: inputPass.value,
    };

    const settings = {
      method: "POST",
      body: JSON.stringify(usuario),
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(url, settings)
      .then((response) => {
        return response.json();
      })
      .then((respuesta) => {
        realizarLogin(respuesta);

      })
      .catch((error) => {
        console.log(`Ocurrió un error: ${error}`);
        ocultarSpinner();
      });
  });

  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 2: Realizar el login [POST]                    */
  /* -------------------------------------------------------------------------- */
  function realizarLogin(settings) {
    if (settings.jwt) {
      ocultarSpinner();
      localStorage.setItem("jwt", JSON.stringify(settings.jwt));
      location.replace("mis-tareas.html");
    } else {
      ocultarSpinner();
      formLogin.classList.remove("hidden");
      const a = document.querySelector("a");
      a.classList.remove("hidden");
      const span = document.querySelector(".campo-login");
      span.innerHTML = `${settings}`;
      console.log(`Ocurrió un error: ${settings}`);
    }
  }
});