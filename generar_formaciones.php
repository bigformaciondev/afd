<?php

require __DIR__ . '/vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

function leerFormacionesExcel($archivoRuta)
{
    echo "📥 Cargando archivo: {$archivoRuta}\n";

    if (!file_exists($archivoRuta)) {
        echo "❌ El archivo no existe.\n";
        return;
    }

    $spreadsheet = IOFactory::load($archivoRuta);
    $datos = [];
    $totalFormaciones = 0;
    $totalDuplicadas = 0;

    foreach ($spreadsheet->getSheetNames() as $nombreHoja) {
        echo "📄 Procesando hoja: {$nombreHoja}\n";
        $hoja = $spreadsheet->getSheetByName($nombreHoja);
        if (!$hoja) {
            echo "⚠️ No se pudo cargar la hoja: {$nombreHoja}\n";
            continue;
        }

        $filas = $hoja->toArray(null, true, true, true);
        unset($filas[1]); // Quitar encabezados

        $formaciones = [];
        $clavesUnicas = [];
        $procesadas = 0;

        foreach ($filas as $i => $fila) {
            if (empty(array_filter($fila))) continue;

            $modalidad = normalizarModalidad($fila['E'] ?? '');

            $formacion = [
                'comunidad'    => limpiarTexto($fila['A'] ?? ''),
                'provincia'    => limpiarTexto($fila['B'] ?? ''),
                'localidad'    => limpiarTexto($fila['C'] ?? ''),
                'entidad'      => limpiarTexto($fila['D'] ?? ''),
                'modalidad'    => $modalidad,
                'centro'       => limpiarTexto($fila['F'] ?? ''),
                'familia'      => strtoupper(limpiarTexto($fila['G'] ?? '')),
                'codigo'       => strtoupper(limpiarTexto($fila['H'] ?? '')),
                'especialidad' => limpiarTexto($fila['I'] ?? ''),
                'fecha_inicio' => convertirFecha($fila['J'] ?? '')
            ];

            $clave = implode('|', [
                $formacion['provincia'],
                $formacion['centro'],
                $formacion['familia'],
                $formacion['codigo'],
                $formacion['especialidad']
            ]);

            if (isset($clavesUnicas[$clave])) {
                $totalDuplicadas++;
                continue;
            }

            $clavesUnicas[$clave] = true;
            $formaciones[] = $formacion;
            $procesadas++;
        }

        $datos[$nombreHoja] = array_values($formaciones);
        $totalFormaciones += $procesadas;

        echo "✅ Hoja '{$nombreHoja}' procesada: {$procesadas} registros únicos.\n";
    }

    $jsonRuta = 'assets/data/formaciones_2025_2026.json';
    file_put_contents($jsonRuta, json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    echo "💾 Archivo JSON generado en: {$jsonRuta}\n";
    echo "📊 Total formaciones únicas: {$totalFormaciones}\n";
    echo "🧹 Duplicadas ignoradas: {$totalDuplicadas}\n";
}

function limpiarTexto($texto)
{
    $texto = trim($texto);
    $texto = preg_replace('/\s+/', ' ', $texto);
    return mb_convert_encoding($texto, 'UTF-8', 'auto');
}

function normalizarModalidad($valor)
{
    $valor = strtoupper(trim(preg_replace('/\s+/', ' ', $valor)));

    switch ($valor) {
        case 'TELEFORMACION':
        case 'TELE-FORMACIÓN':
        case 'TELEFORMACIÓN':
            return 'TELEFORMACIÓN';
        case 'AULA VIRTUAL':
        case 'AULA-VIRTUAL':
            return 'AULA VIRTUAL';
        case 'PRESENCIAL':
            return 'PRESENCIAL';
        default:
            return $valor;
    }
}

function convertirFecha($fecha)
{
    if (is_numeric($fecha)) {
        return \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($fecha)->format('Y-m-d');
    }

    $formatos = ['d/m/Y', 'j/n/Y', 'Y-m-d', 'd-m-Y'];
    foreach ($formatos as $formato) {
        $fechaObj = DateTime::createFromFormat($formato, $fecha);
        if ($fechaObj) {
            return $fechaObj->format('Y-m-d');
        }
    }
    return '';
}

// Ejecutar
leerFormacionesExcel(__DIR__ . '/base_datos_formaciones_web.xlsx');
