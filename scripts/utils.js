/* ---------------------------------- texto --------------------------------- */
function validarTexto(texto1,texto2) {
    let valido = false;
    const span = document.querySelector(".campo-texto");
    if((texto1.length > 20 || texto1.length < 3)|| (texto2.length > 20 || texto2.length < 3)) {
        
        span.innerText = `Los campos ingresados deben tener entre 4 y 20 caracteres.`
        valido = false;
        
          
    }else{
        span.innerText = "";
        valido = true;
        
    }
        
    console.log(valido);
    return valido;
    
    
}

function normalizarTexto(texto1,texto2) {
    console.log(texto1.toUpperCase())
    console.log(texto2.toUpperCase())

    return texto1,texto2;
           
}

/* ---------------------------------- email --------------------------------- */
function validarEmail(email) {
    const span = document.querySelector(".campo-email");
    let expresionEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (email.match(expresionEmail)) {
                
                span.innerText = "";
                return true;
            } else {
                span.innerText = "El email ingresado es inválido."
            }
}

function normalizarEmail(email) {
    console.log(email.toUpperCase())
    return email.toUpperCase()
}

/* -------------------------------- password -------------------------------- */
function validarContrasenia(contrasenia) {
    const span = document.querySelector(".campo-contrasenia");
    let ExpresionConstrasenia = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            if(contrasenia.match(ExpresionConstrasenia)) {
                span.innerText = "";
                return true;
            } else {
                span.innerText = 'La contraseña debe contener al menos 8 caractéres, letras y números';
            }
}

function compararContrasenias(contrasenia_1, contrasenia_2) {
    const span = document.querySelector(".campo-contrasenia-dos");
    if (contrasenia_1 != contrasenia_2) {
        span.innerText = "Las passwords deben de coincidir";
        return false;
    } else {
        span.innerText = "";
        return true;
    }

}

        // module.exports = {
        //     validarTexto, 
        //     validarEmail,
        //     validarContrasenia,
        //     normalizarTexto,
        //     normalizarEmail,
        //     compararContrasenias
        // }
