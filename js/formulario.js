import { mostrarNotificacion } from './modal.js';

export function initFormulario() {
  const form = document.getElementById('form-contacto');
  if (!form) return;

  if (form.dataset.listenerAdded) return;
  form.dataset.listenerAdded = "true";

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre-usuario')?.value.trim() || '';
    const email = document.getElementById('email-usuario')?.value.trim() || '';
    const telefono = document.getElementById('telefono-usuario')?.value.trim() || '';
    const descripcion = document.getElementById('descripcion-usuario')?.value.trim() || '';
    const curso = document.getElementById('modal-curso-input')?.value.trim() || '';
    const codigo = document.getElementById('modal-codigo-input')?.value.trim() || '';

    if (!validarCampos(nombre, email, telefono)) {
      return; // No enviar si no es válido
    }

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

      let result;
      try {
        result = await response.json();
      } catch {
        mostrarNotificacion("Error", "Respuesta inválida del servidor.");
        return;
      }

      if (!response.ok || !result.success) {
        mostrarNotificacion("Error", result.message || "Ha ocurrido un error en el envío.");
        return;
      }

      mostrarNotificacion("Enviado", "Tu solicitud se ha enviado correctamente.");

      // Cerrar modal usando función expuesta por initModal.js
      if (typeof window.cerrarModal === "function") {
        window.cerrarModal();
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
