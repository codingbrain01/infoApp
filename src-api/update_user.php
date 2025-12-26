<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/* =========================
   DB CONNECTION
========================= */
$conn = new mysqli(
    "localhost",
    "root",
    "",
    "userdb"
);

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit;
}

/* =========================
   READ INPUT
========================= */
$data = json_decode(file_get_contents("php://input"), true);

if (
    empty($data['id']) ||
    empty($data['firstname']) ||
    empty($data['lastname']) ||
    empty($data['email']) ||
    !filter_var($data['email'], FILTER_VALIDATE_EMAIL)
) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid input data"
    ]);
    exit;
}

/* =========================
   CHECK DUPLICATE EMAIL
   (EXCLUDE CURRENT USER)
========================= */
$checkStmt = $conn->prepare(
    "SELECT id FROM user_profile WHERE email = ? AND id != ? LIMIT 1"
);

$checkStmt->bind_param("si", $data['email'], $data['id']);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "message" => "Email already exists"
    ]);
    $checkStmt->close();
    $conn->close();
    exit;
}

$checkStmt->close();

/* =========================
   UPDATE USER
========================= */
$stmt = $conn->prepare(
    "UPDATE user_profile
     SET firstname = ?, lastname = ?, email = ?, phone = ?, age = ?, sex = ?
     WHERE id = ?"
);

$stmt->bind_param(
    "ssssisi",
    $data['firstname'],
    $data['lastname'],
    $data['email'],
    $data['phone'],
    $data['age'],
    $data['sex'],
    $data['id']
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "User updated successfully"
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Update failed"
    ]);
}

$stmt->close();
$conn->close();
