//funcion para mostrar la alerta
import { mostrarAlertas } from "./helpers/mostrar-alerta.js";

//variables
const formulario = document.querySelector("#formulario");
//tbody
const tbody = document.querySelector('#tbody');

//listeners
document.addEventListener('DOMContentLoaded', () => {
    //formulario
    formulario.addEventListener('submit', enviarInformacion);
    //mostrar los registros en la tabla
    obtenerRegistrosApi();
    //eliminar un usuario
    tbody.addEventListener('click', idUsuarioEliminar);
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
        mostrarAlertas('Los campos no deben estar vacios', 'error');
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
async function crearUsuario( usuarioObj ) {

    const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        const raw = JSON.stringify( usuarioObj );

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        await fetch("http://localhost:5000/api/usuarios", requestOptions)
        .then(response => response.json() )
        .then(result => {
            //console.log( result.status );
            if ( result.status === 200) {
                mostrarAlertas('El usuario se registro correctamente', 'success');
                formulario.reset();
            }else {
                //funcion para mostrar los errores desde la API
                mostrarAlertasApi(result.errores);
            }
        })
        .catch(error => console.log('error', error));
   
}

//funcion para mostrar las alertas
function mostrarAlertasApi( mensajesApi ) {
    //console.log(mensajesApi.errors);
    //console.log( typeof mensajesApi , "errores apis");
    mensajesApi.errors.forEach( mensaje  => {
        //console.log( mensaje.msg );
        const alerta = document.createElement('div');
        alerta.classList.add('mt-5','mb-3', 'alertaApi');
        //verificar el tipo de mensaje
        alerta.innerHTML = `
            <div class="alert alert-danger" role="alert">
                ${ mensaje.msg }
            </div>
        `;

        formulario.appendChild( alerta );
        //quitar las alertas
        setTimeout(() => {
            alerta.remove();
        }, 5000);
    });
}
//funcion para mostrar los registros en la tabla
async function obtenerRegistrosApi() {
    try {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
        await fetch("http://localhost:5000/api/usuarios?limite=15", requestOptions)
            .then(response => response.text())
            .then(result => mostrarRegistrosHTML( JSON.parse( result ) ))
            .catch(error => console.log('error', error));
    } catch (error) {
        console.log( error );
    }
}
//funcion para mostrar los registros
function mostrarRegistrosHTML( registros ) {
    //limpiar registros previos
    limpiarHTML();

    //foreach
    registros.usuarios.forEach( usuario => {
        //desestructurar
        const { _id, correo, estado, nombre, rol } = usuario;
        let user;
        let activo;
        if (rol === 'ADMIN_ROLE') {
            user = 'Rol de Adminsitrador';
        }else {
            user = 'Rol de usuario';
        }

        if ( estado ) {
            activo = 'ACTIVO';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${nombre}</td>
            <td>${correo}</td>
            <td>${ user }</td>
            <td>${ activo }</td>
            <td>
                <a href="editar-usuario.html?id=${ _id }" id="editar" class="editar" title="Editar Usuario"><i class="fa-solid fa-wand-magic-sparkles"></i></a>
                <a href="#" data-cliente="${ _id }" class="eliminar fa-solid fa-file-circle-xmark" title="Eliminar Usuario"></a>
            </td>
        `;
        //botones
        const buttonEditar = document.createElement('a');
        buttonEditar.classList.add('editar');
        buttonEditar.classList.add('editar');

        //append
        tbody.append( row );

    });
}
//funcion para eliminar usuario
function idUsuarioEliminar( e ) {
    //verificar que se de CLICK en el boton eliminar
    if ( e.target.classList.contains('eliminar') ) {
        const idUsuario = e.target.dataset.cliente;
        //funcion para borrar el usuario
        eliminarUsuario( idUsuario );
        //mostrar mensaje
        mostrarAlertas('El usuario ha sido eliminado', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 4000);
    }
    
}
//eliminar usuario
function eliminarUsuario( idUsuario ) {
    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
      };
      
    fetch(`http://localhost:5000/api/usuarios/${ idUsuario  }`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}
//limpiar el html
function limpiarHTML() {
    while( tbody.firstChild ) {
        tbody.removeChild(tbody.firstChild);
    }
}