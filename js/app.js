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

    //creamos un objeto con la informacion
    const usuarioObj = {
        nombre,
        correo,
        password,
        rol
    }
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
    .then(result => {
        if ( result.errors ) {
            //mostrar alertas
            mostrarAlertas( result.errors );
            return;
        }
        console.log(result)
    })
    .catch(error => console.log('error', error));
}
//funcion para mostrar las alertas
function mostrarAlertas( errores ) {
    errores.forEach( error => {
        console.log( error );
        console.log( error.msg );
        const alerta = document.createElement('div');
        alerta.classList.add('mb-3');
        alerta.innerHTML = `
            <div class="alert alert-danger" role="alert">
                ${ error.msg }
            </div>
        `;
        formulario.appendChild( alerta );
        //quitar las alertas
        setTimeout(() => {
            alerta.remove();
        }, 4000);
    });
}