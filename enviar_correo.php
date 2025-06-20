<?php
header('Content-Type: application/json; charset=utf-8');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

require __DIR__ . '/vendor/autoload.php';

// Cargar variables del .env
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Funciones de validación
function validarNombre($nombre) {
    return preg_match('/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s\'.-]{2,50}$/u', $nombre);
}
function validarEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}
function validarTelefono($telefono) {
    return preg_match('/^[0-9+\-\s()]{7,20}$/', $telefono);
}
function limpiarTexto($texto) {
    return htmlspecialchars(strip_tags(trim($texto)));
}

// Recolectar y limpiar datos
$curso       = limpiarTexto($_POST['curso'] ?? '');
$codigo      = limpiarTexto($_POST['codigo'] ?? '');
$nombre      = limpiarTexto($_POST['nombre'] ?? '');
$email       = limpiarTexto($_POST['email'] ?? '');
$telefono    = limpiarTexto($_POST['telefono'] ?? '');
$descripcion = limpiarTexto($_POST['descripcion'] ?? '');

// Honeypot: campo oculto para bots
$honeypot = $_POST['honeypot'] ?? '';
if ($honeypot !== '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Error anti-spam detectado']);
    exit;
}

// Validar código (nuevo)
function validarCodigo($codigo) {
    return preg_match('/^[A-Za-z0-9\-]{0,20}$/', $codigo);
}

if (!validarCodigo($codigo)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Código no válido']);
    exit;
}

// Validar campos obligatorios
if (!$curso || !$nombre || !$email || !$telefono) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Faltan campos obligatorios']);
    exit;
}

if (!validarNombre($nombre)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Nombre no válido']);
    exit;
}
if (!validarEmail($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email no válido']);
    exit;
}
if (!validarTelefono($telefono)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Teléfono no válido']);
    exit;
}
if (mb_strlen($descripcion) > 1000) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'La descripción es demasiado extensa']);
    exit;
}

// HTML del correo
$mensajeHTML = '
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Solicitud de Información</title>
  <style>
    body {
      font-family: "Segoe UI", Roboto, sans-serif;
      background-color: #f8f9fa;
      margin: 0;
      padding: 20px;
    }
    .container {
      background: #ffffff;
      padding: 30px;
      border-radius: 10px;
      border: 1px solid #dee2e6;
      max-width: 600px;
      margin: auto;
      text-align: center;
    }
    .logo img {
      max-width: 180px;
      margin-bottom: 20px;
    }
    h2 {
      color: #0d6efd;
      margin-bottom: 30px;
    }
    .info {
      text-align: left;
      display: inline-block;
      text-align: left;
    }
    .dato {
      margin-bottom: 12px;
      font-size: 15px;
    }
    .etiqueta {
      font-weight: bold;
      display: inline-block;
      min-width: 100px;
    }
    .footer {
      margin-top: 30px;
      font-size: 13px;
      color: #6c757d;
    }
    a {
      color: #0d6efd;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="cabecera">
        <img src="cid:cabeceraCorreo" alt="Cabecera" style="width: 100%; height: auto; border-top-left-radius: 10px; border-top-right-radius: 10px;">
    </div>

    <h2>Solicitud de Información</h2>
    <div class="info">
      <p class="dato"><span class="etiqueta">📘 Curso:</span> ' . $curso . '</p>
      <p class="dato"><span class="etiqueta">🔢 Código:</span> ' . $codigo . '</p>
      <p class="dato"><span class="etiqueta">👤 Nombre:</span> ' . $nombre . '</p>
      <p class="dato"><span class="etiqueta">📧 Email:</span> <a href="mailto:' . $email . '">' . $email . '</a></p>
      <p class="dato"><span class="etiqueta">📱 Teléfono:</span> ' . $telefono . '</p>
      <p class="dato"><span class="etiqueta">📝 Descripción:</span> ' . nl2br($descripcion) . '</p>
    </div>
    <div class="footer">
      Correo generado automáticamente desde el formulario de 
      <a href="https://bigformacion.com">bigformacion.com</a>
    </div>
  </div>
</body>
</html>
';

$mail = new PHPMailer(true);

// Validar variables entorno
$required_env = ['SMTP_HOST','SMTP_USERNAME','SMTP_PASSWORD','SMTP_ENCRYPTION','SMTP_PORT','MAIL_FROM','MAIL_FROM_NAME','MAIL_TO_1','MAIL_TO_2'];
foreach ($required_env as $env_var) {
    if (empty($_ENV[$env_var])) {
        http_response_code(500);
        error_log("Falta variable de entorno: $env_var");
        echo json_encode(['success' => false, 'message' => 'Error de configuración.']);
        exit;
    }
}

try {
    // Configuración SMTP desde .env
    $mail->isSMTP();
    $mail->Host       = $_ENV['SMTP_HOST'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $_ENV['SMTP_USERNAME'];
    $mail->Password   = $_ENV['SMTP_PASSWORD'];
    $mail->SMTPSecure = $_ENV['SMTP_ENCRYPTION'];
    $mail->Port       = $_ENV['SMTP_PORT'];

    // Codificación UTF-8
    $mail->CharSet = 'UTF-8';

    // Remitente
    $mail->setFrom($_ENV['MAIL_FROM'], $_ENV['MAIL_FROM_NAME']);

    // Destinatarios fijos
    $mail->addAddress($_ENV['MAIL_TO_1']);
    $mail->addAddress($_ENV['MAIL_TO_2']);

    // Copia al usuario que escribió
    $mail->addReplyTo($email, $nombre);
    $mail->addCC($email);

    // Embebido de imagen
    $imgPath = __DIR__ . '/assets/img/portfolio-1.webp';
    if (file_exists($imgPath)) {
        $mail->AddEmbeddedImage($imgPath, 'cabeceraCorreo', 'portfolio-1.webp');
    }

    $mail->isHTML(true);
    $mail->Subject = mb_encode_mimeheader("Solicitud de información - Curso: $curso", 'UTF-8', 'B');
    $mail->Body    = $mensajeHTML;

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Correo enviado correctamente']);
} catch (Exception $e) {
    http_response_code(500);
    error_log("Error PHPMailer: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error al enviar el correo.']);
}
