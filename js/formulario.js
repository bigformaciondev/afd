import { mostrarNotificacion } from './modal.js';

export function initFormulario() {
  const form = document.getElementById('form-contacto');
  if (!form) return;

  // Debug: contar listeners en consola (solo en devtools)
  try {
    console.log('Listeners submit en form:', getEventListeners(form).submit.length);
  } catch { /* no disponible fuera consola */ }

  // Evitar añadir doble listener
  if (form.dataset.listenerAdded) {
    console.warn("Listener ya añadido a form-contacto");
    return;
  }
  form.dataset.listenerAdded = "true";

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    console.log('Submit recibido');

    const nombre = document.getElementById('nombre-usuario')?.value.trim() || '';
    const email = document.getElementById('email-usuario')?.value.trim() || '';
    const telefono = document.getElementById('telefono-usuario')?.value.trim() || '';
    const descripcion = document.getElementById('descripcion-usuario')?.value.trim() || '';
    const curso = document.getElementById('modal-curso-input')?.value.trim() || '';
    const codigo = document.getElementById('modal-codigo-input')?.value.trim() || '';

    if (!validarCampos(nombre, email, telefono)) {
      console.log('Validación fallida, bloqueando envío');
      return false; // detener envío
    }

    // Definir los datos para enviar
    const datos = new URLSearchParams({
      nombre,
      email,
      telefono,
      descripcion,
      curso,
      codigo
    });

    const btn = document.getElementById('btn-enviar');
    const spinner = document.getElementById('btn-spinner');
    const btnText = document.getElementById('btn-text');

    btn.disabled = true;
    spinner.classList.remove('d-none');
    btnText.style.opacity = '0.5';

    try {
      const response = await fetch('enviar_correo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: datos
      });

      const textoPlano = await response.text();
      let result;

      try {
        result = JSON.parse(textoPlano);
      } catch (e) {
        console.error("Respuesta no válida:", textoPlano);
        throw new Error("La respuesta del servidor no es JSON válido.");
      }

      if (result.success) {
        mostrarNotificacion("Enviado", "Tu solicitud se ha enviado correctamente.");
        form.reset();
        cerrarModal();
      } else {
        mostrarNotificacion("Error", result.message || "Ha ocurrido un error.");
      }

    } catch (error) {
      console.error("Error en el envío del formulario:", error);
      mostrarNotificacion("Error", "No se pudo enviar el formulario. Intenta más tarde.");
    } finally {
      btn.disabled = false;
      spinner.classList.add('d-none');
      btnText.style.opacity = '1';
    }
  });
}

function validarCampos(nombre, email, telefono) {
  const nombreValido = /^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s'.-]{2,50}$/.test(nombre);
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const formatoValido = /^[0-9+\-\s()]{7,20}$/.test(telefono);
  const contieneLetras = /[a-zA-Z]/.test(telefono);
  const telefonoValido = telefono.length > 0 && formatoValido && !contieneLetras;

  if (!nombreValido) {
    mostrarNotificacion("Error", "El nombre no es válido.");
    return false;
  }

  if (!emailValido) {
    mostrarNotificacion("Error", "El email no tiene un formato válido.");
    return false;
  }

  if (!telefonoValido) {
    mostrarNotificacion("Error", "El teléfono debe contener solo números o caracteres válidos y no puede estar vacío.");
    return false;
  }

  return true;
}
