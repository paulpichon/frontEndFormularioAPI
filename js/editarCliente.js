document.addEventListener('DOMContentLoaded', async() => {
    const parametrosURL = new URLSearchParams( window.location.search );
    //convertirlo a un enterp
    const idUsuario = parametrosURL.get('id');
    //variable con el objeto Usuario
    const usuario = await obtenerClientePorId( idUsuario );
    //funcion para mostrar el usuario en el formulario
    mostrarInfoUsuario( usuario );
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
    passwordEditar.value = '*********';
    rolEditar.value = rol;
}