<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Cache-Control, Accept, Origin');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
try {
    $filePath = '../xml/resume.xml';
    if (!file_exists($filePath)) {
        throw new Exception("No resume.xml found.");
    }

    $xml = simplexml_load_file($filePath);
    if ($xml === false) {
        throw new Exception("Failed to parse resume.xml.");
    }

    $score = 0;
    $rules = [];

    $addRule = function($name, $passed, $tip, $points) use (&$score, &$rules) {
        if ($passed) $score += $points;
        $rules[] = [
            "name" => $name,
            "passed" => $passed,
            "tip" => $tip
        ];
    };

    $summaryText = trim((string)$xml->summary);
    $passSummary = strlen($summaryText) > 50;
    $addRule("Professional Summary", $passSummary, "Add a professional summary of at least 2–3 sentences", 10);

    $skillsCount = 0;
    foreach ($xml->skills->skill as $s) {
        if (trim((string)$s) !== 'Add a skill' && trim((string)$s) !== '') {
            $skillsCount++;
        }
    }
    $passSkills = $skillsCount >= 6;
    $addRule("Skills Count", $passSkills, "Add more relevant skills — aim for at least 6", 15);

    $passQuantified = false;
    foreach ($xml->experience->job as $j) {
        $desc = (string)$j->description;
        if (preg_match('/[%0-9]/', $desc) || preg_match('/(?:increased|reduced|led|saved)/i', $desc)) {
            $passQuantified = true;
            break;
        }
    }
    $addRule("Quantified Achievements", $passQuantified, "Quantify your achievements (e.g. 'Increased performance by 30%')", 20);

    $passContact = trim((string)$xml->personal->email) !== '' && trim((string)$xml->personal->phone) !== '';
    $addRule("Contact Info", $passContact, "Add your email and phone number", 10);

    $projectsCount = 0;
    if (isset($xml->projects->project)) {
        foreach ($xml->projects->project as $p) {
            if (trim((string)$p->name) !== '') {
                $projectsCount++;
            }
        }
    }
    $passProject = $projectsCount >= 1;
    $addRule("Projects", $passProject, "Add at least one project to show practical skills", 10);

    $passEdu = false;
    foreach ($xml->education->degree as $d) {
        if (trim((string)$d->institution) !== '' && trim((string)$d->year) !== '') {
            $passEdu = true;
            break;
        }
    }
    $addRule("Education", $passEdu, "Complete your education section", 10);

    $passLinkedin = isset($xml->personal->linkedin) && trim((string)$xml->personal->linkedin) !== '';
    $addRule("LinkedIn URL", $passLinkedin, "Add your LinkedIn profile URL", 10);

    $totalText = $summaryText . " ";
    foreach ($xml->skills->skill as $s) { $totalText .= (string)$s . " "; }
    foreach ($xml->experience->job as $j) { $totalText .= (string)$j->description . " "; }
    if (isset($xml->projects->project)) {
        foreach ($xml->projects->project as $p) { $totalText .= (string)$p->description . " "; }
    }
    
    $words = str_word_count($totalText);
    $passWordCount = $words >= 300 && $words <= 700;
    $addRule("Word Count", $passWordCount, "Resume is too short/long — aim for 300–700 words", 15);

    echo json_encode([
        "success" => true,
        "score" => $score,
        "rules" => $rules,
        "wordCount" => $words
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
