<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Cache-Control, Accept, Origin');
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
require_once __DIR__ . '/../vendor/autoload.php';

try {
    $xmlPath = '../xml/resume.xml';
    $xslPath = '../xsl/resume-pdf.xsl';
    
    if (!file_exists($xmlPath) || !file_exists($xslPath)) {
        throw new Exception("Missing required XML or XSL files.");
    }

    $xml = new DOMDocument;
    $xml->load($xmlPath);

    $xsl = new DOMDocument;
    $xsl->load($xslPath);

    $proc = new XSLTProcessor;
    $proc->importStyleSheet($xsl);

    $html = $proc->transformToXML($xml);

    if ($html === false) {
        throw new Exception("XSLT Transformation failed.");
    }

    $mpdf = new \Mpdf\Mpdf([
        'mode' => 'utf-8',
        'format' => 'A4',
        'margin_left' => 15,
        'margin_right' => 15,
        'margin_top' => 15,
        'margin_bottom' => 15,
        'margin_header' => 0,
        'margin_footer' => 0,
        'default_font' => 'helvetica'
    ]);

    $mpdf->SetTitle('ATS Resume');
    $mpdf->SetAuthor('ResumeForge');

    $mpdf->WriteHTML($html);

    $mpdf->Output('resume.pdf', \Mpdf\Output\Destination::DOWNLOAD);

} catch (Exception $e) {
    http_response_code(500);
    echo "Error generating PDF: " . htmlspecialchars($e->getMessage());
}
?>
