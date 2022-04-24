window.addEventListener("load", function() {

    const formLogin = document.forms[0];
    const inputEmail = document.querySelector("#inputEmail");
    const inputPass = document.querySelector("#inputPassword");
    const url = "https://ctd-todo-api.herokuapp.com/v1/users/login";

    /* ---------------------------------------------------------------------------------- */
    /*                  FUNCION 1: Escuchamos el submit y preparamos el envio             */
    /* ---------------------------------------------------------------------------------- */

    form.addEventListener("submit", function(event){
        event.preventDefault();
        //creamos el cuerpo de la request
        const payload = {
            email: inputEmail.value,
            password: inputPass.value
        };
        const settings = {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json"
            }
        };
        //lanzamos la consulta de login a la API
        renderizarLogin(settings);
        //limpio los campos del formulario
        form.reset();
    });
    function renderizarLogin(settings) {
    console.log("Lanzando la consulta a la API");
    fetch(url, settings)
        .then(Response => {
            console.log(response);
            if(response.ok != true) {
                alert("Alguno de los datos es incorrecto")
            }

            return response.JSON();
        })
        .then(data =>{
            console.log("Promesa cumplida");
            console.log(data);
            if(data.jwt) {
                //guardo en el local storage el objeto con el token
                localStorage.setItem("jwt", JSON.stringify(data.jwt));
               
                //redireccionamos a la pagina
                location.replace("./mis-tareas.html");
            }
        })
        .catch(err => {
            console.log("Promesa rechazada");
            console.log(err);
        })
};

});

