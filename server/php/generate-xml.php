<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Cache-Control, Accept, Origin');
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
try {
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);

    if (!isset($input['xml'])) {
        throw new Exception("No XML data provided.");
    }

    $xmlString = $input['xml'];
    $filePath = '../xml/resume.xml';
    $bytes = file_put_contents($filePath, $xmlString);
    if ($bytes === false) {
        throw new Exception("Failed to write XML to file.");
    }

    $dom = new DOMDocument();
    libxml_use_internal_errors(true);
    
    $dom->load($filePath, LIBXML_DTDVALID);
    if (!$dom->validate()) {
        $errors = libxml_get_errors();
        $errorMsg = "XML validation against DTD failed.";
        if (count($errors) > 0) {
            $errorMsg .= " " . $errors[0]->message;
        }
        libxml_clear_errors();
        throw new Exception($errorMsg);
    }
    libxml_clear_errors();

    echo json_encode(["success" => true, "xml" => $xmlString]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
