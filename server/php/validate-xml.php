<?php
header('Content-Type: application/json');

try {
    $filePath = '../xml/resume.xml';
    
    if (!file_exists($filePath)) {
        throw new Exception("XML file does not exist.");
    }

    $dom = new DOMDocument();
    
    libxml_use_internal_errors(true);
    
    if (!$dom->load($filePath, LIBXML_DTDVALID)) {
        throw new Exception("Failed to load XML file.");
    }

    if (!$dom->validate()) {
        $errors = libxml_get_errors();
        $errorMsg = "XML validation failed.";
        $errorDetails = [];
        foreach ($errors as $error) {
            $errorDetails[] = trim($error->message);
        }
        libxml_clear_errors();
        
        echo json_encode([
            "success" => false, 
            "error" => $errorMsg, 
            "details" => $errorDetails
        ]);
        exit;
    }
    libxml_clear_errors();

    echo json_encode(["success" => true, "message" => "XML is valid against DTD."]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
