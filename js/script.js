
function abrirModal() {
    const modal = document.getElementById('modalAporte');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function cerrarModal() {
    const modal = document.getElementById('modalAporte');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('statusMensaje').innerText = '';
    }
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('modalAporte');
    if (e.target === modal) {
        cerrarModal();
    }
});

function cambiarTipoEnvio() {
    const tipo = document.getElementById('tipoEnvio').value;
    const campoUrl = document.getElementById('campoUrl');
    const campoArchivo = document.getElementById('campoArchivo');
    const inputUrl = document.getElementById('linkPdf');
    const inputArchivo = document.getElementById('filePdf');

    if (tipo === 'url') {
        campoUrl.style.display = 'block';
        campoArchivo.style.display = 'none';
        
        inputUrl.setAttribute('required', 'true');
        inputArchivo.removeAttribute('required');
        inputArchivo.value = ''; // Limpiar selección previa
    } else {
        campoUrl.style.display = 'none';
        campoArchivo.style.display = 'block';
        
        inputArchivo.setAttribute('required', 'true');
        inputUrl.removeAttribute('required');
        inputUrl.value = ''; // Limpiar texto previo
    }
}

async function enviarAporte(event) {
    event.preventDefault();

    const status = document.getElementById('statusMensaje');
    const btnSubmit = document.getElementById('btnSubmit');

    const data = {
        Libro: document.getElementById('nombreLibro').value,
        Autor: document.getElementById('autorLibro').value,
        Enlace_PDF: document.getElementById('linkPdf').value,
        Notas: document.getElementById('mensajeUsuario').value
    };

    status.style.color = '#f1d38a';
    status.innerText = '⏳ Enviando aporte...';
    btnSubmit.disabled = true;

    try {
        const response = await fetch('https://formspree.io/f/mdeonaod', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            status.style.color = '#4caf50';
            status.innerText = '✅ ¡Aporte recibido con éxito!';
            document.getElementById('pdfForm').reset();
            setTimeout(() => {
                cerrarModal();
                btnSubmit.disabled = false;
            }, 3000);
        } else {
            throw new Error();
        }
    } catch (error) {
        status.style.color = '#ff6b6b';
        status.innerText = '❌ Error al enviar. Asegúrate de ingresar una URL válida (http://...)';
        btnSubmit.disabled = false;
    }
}