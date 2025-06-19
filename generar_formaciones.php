<?php

require __DIR__ . '/vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

function leerFormacionesExcel($archivoRuta)
{
    $spreadsheet = IOFactory::load($archivoRuta);
    $datos = [];

    foreach ($spreadsheet->getSheetNames() as $nombreHoja) {
        $hoja = $spreadsheet->getSheetByName($nombreHoja);
        if (!$hoja) continue;

        $filas = $hoja->toArray(null, true, true, true);
        unset($filas[1]); // Quitar encabezados

        $formaciones = [];

        foreach ($filas as $fila) {
            if (empty(array_filter($fila))) continue;

            $formaciones[] = [
                'comunidad'    => $fila['A'] ?? '',
                'provincia'    => $fila['B'] ?? '',
                'localidad'    => $fila['C'] ?? '',
                'entidad'      => $fila['D'] ?? '',
                'modalidad'    => $fila['E'] ?? '',
                'centro'       => $fila['F'] ?? '',
                'codigo'       => $fila['G'] ?? '',
                'especialidad' => $fila['H'] ?? '',
                'fecha_inicio' => convertirFecha($fila['I'] ?? ''),
            ];
        }

        $datos[$nombreHoja] = $formaciones;
    }

    file_put_contents('assets/data/formaciones_2025_2026.json', json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    echo "JSON generado correctamente.";
}

function convertirFecha($fecha)
{
    if (is_numeric($fecha)) {
        return \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($fecha)->format('Y-m-d');
    }

    $fechaObj = DateTime::createFromFormat('j/n/Y', $fecha);
    return $fechaObj ? $fechaObj->format('Y-m-d') : '';
}

leerFormacionesExcel(__DIR__ . '/base_datos_formaciones_web.xlsx');
