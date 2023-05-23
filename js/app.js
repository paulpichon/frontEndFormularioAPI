//variables
const formulario = document.querySelector("#formulario");

//listeners
document.addEventListener('DOMContentLoaded', () => {
    //formulario
    formulario.addEventListener('submit', enviarInformacion);
});


//funciones
function enviarInformacion( e ) {
    //prevenir 
    e.preventDefault();
    //inputs
    const nombre = document.querySelector('#nombre').value;
    const correo = document.querySelector('#correo').value;
    const password = document.querySelector('#password').value;
    const rol = document.querySelector('#rol').value;

    //validar que los inputs no esten vacios
    if ([nombre, correo, password, rol].includes('') ) {
        //mostrar alertas
        verificarErrores('Los campos no deben estar vacios');
        return;
    }

    //creamos un objeto con la informacion
    const usuarioObj = {
        nombre,
        correo,
        password,
        rol
    };

    //mandarlo a una funcion para introducirlo a la BD
    crearUsuario( usuarioObj );

}
//funcion para crear el usuario
function crearUsuario( usuarioObj ) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify( usuarioObj );

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:5000/api/usuarios", requestOptions)
    .then(response => response.json())
    .then(result => console.log(result) )
    .catch(error => console.log('error', error));
}
//funcion para mostrar las alertas
function verificarErrores( mensaje ) {
    
    //verificar si hay alertas previas
    const alertas = document.querySelector('.alerta');
    //si no hay alertas no mostrarlas
    if ( !alertas ) {
        const alerta = document.createElement('div');
        alerta.classList.add('mt-5','mb-3', 'alerta');
        alerta.innerHTML = `
            <div class="alert alert-danger" role="alert">
                ${ mensaje }
            </div>
        `;
        formulario.appendChild( alerta );
        //quitar las alertas
        setTimeout(() => {
            alerta.remove();
        }, 4000);
    }
}
