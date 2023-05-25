//importar funcion para mostrar alertas
import { mostrarAlertas } from "../helpers/mostrar-alerta.js";

//listeners
document.addEventListener('DOMContentLoaded', async() => {
    
    const parametrosURL = new URLSearchParams( window.location.search );
    //convertirlo a un enterp
    const idUsuario = parametrosURL.get('id');
    //variable con el objeto Usuario
    const usuario = await obtenerClientePorId( idUsuario );
    //funcion para mostrar el usuario en el formulario
    mostrarInfoUsuario( usuario );

    //funcion para guardar los cambios
    const formEditar = document.querySelector('#formulario');
    formEditar.addEventListener('submit', guardarCambios);
});
//obtener un usuario por el ID
async function obtenerClientePorId( id ) {
    try {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };

        const respuesta = await fetch(`http://localhost:5000/api/usuarios/${ id }`, requestOptions)
            .then(response => response.json())
            .then(result => result)
            .catch(error => console.log('error', error));
        //retornar la respuesta 
        return respuesta;
        
    } catch (error) {
        console.log( error );
    }
}
//funcion para mostrar el usuario en el formulario
function mostrarInfoUsuario( usuario ) {

    const { nombre, rol } = usuario;
    //variables html
    const nombreEditar = document.querySelector('#nombre');
    const passwordEditar = document.querySelector('#password');
    const rolEditar = document.querySelector('#rol');

    nombreEditar.value = nombre;
    passwordEditar.value = '******';
    rolEditar.value = rol;
}
//funcion para guardar los cambios
function guardarCambios( e ) {
    e.preventDefault();
    //valores
    const nombre = document.querySelector('#nombre').value;
    const password = document.querySelector('#password').value;
    const rol = document.querySelector('#rol').value;

    //construir un objeto con los datos
    const infoUsuario = {
        nombre,
        rol
    }

    //verificar si el password es igual o ha sido modificado
    if (password !== '******') {
        //introducir password al objeto
        infoUsuario.password = password;
    }

    //mandar el objeto a la funcion para poder actualizar la BD
    actualizarUsuario( infoUsuario);
    //mostrar alerta de usuario editado
    mostrarAlertas('El usuario ha sido ediatdo', 'success');
}

//funcion para poder actualizar la BD
async function actualizarUsuario( datosActualizar ) {    
    const parametrosURL = new URLSearchParams( window.location.search );
    //convertirlo a un enterp
    const idUsuario = parametrosURL.get('id');
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(datosActualizar);

    var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
    };

    const respuesta = await fetch(`http://localhost:5000/api/usuarios/${ idUsuario }`, requestOptions)
        .then(response => response.text())
        .then(result => JSON.parse( result ))
        .catch(error => console.log('error', error));
    
    //respuesta
    return respuesta;
}