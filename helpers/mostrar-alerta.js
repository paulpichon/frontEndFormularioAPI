//funcion para mostrar las alertas
export function mostrarAlertas( mensaje, tipoMensaje ) {
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