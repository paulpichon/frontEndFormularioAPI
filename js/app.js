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
function mostrarAlertas( mensaje, tipoMensaje ) {
    //verificar si hay alertas previas
    const alertas = document.querySelector('.alerta');
    //si no hay alertas no mostrarlas
    if ( !alertas ) {
        const alerta = document.createElement('div');
        alerta.classList.add('mt-5','mb-3', 'alerta');
        //verificar el tipo de mensaje
        if( tipoMensaje === 'success' ) {
            alerta.innerHTML = `
                <div class="alert alert-success" role="alert">
                    ${ mensaje }
                </div>
            `;

        }else {
            alerta.innerHTML = `
            <div class="alert alert-danger" role="alert">
                ${ mensaje }
            </div>
        `;
        }

        formulario.appendChild( alerta );
        //quitar las alertas
        setTimeout(() => {
            alerta.remove();
        }, 5000);
    }
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
