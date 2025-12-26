<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

$conn = new mysqli('localhost', 'root', '', 'userdb');

if ($conn->connect_error) {
  echo json_encode([
    'success' => false,
    'message' => 'Database connection failed'
  ]);
  exit;
}

$data = json_decode(file_get_contents('php://input'), true);

// Basic validation
if (
  empty($data['firstname']) ||
  empty($data['lastname']) ||
  empty($data['email']) ||
  !filter_var($data['email'], FILTER_VALIDATE_EMAIL)
) {
  echo json_encode([
    'success' => false,
    'message' => 'Invalid input data'
  ]);
  exit;
}

/* ==========================
   CHECK IF EMAIL EXISTS
========================== */
$checkStmt = $conn->prepare(
  "SELECT id FROM user_profile WHERE email = ? LIMIT 1"
);
$checkStmt->bind_param("s", $data['email']);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
  echo json_encode([
    'success' => false,
    'message' => 'Email already exists'
  ]);
  $checkStmt->close();
  $conn->close();
  exit;
}

$checkStmt->close();

/* ==========================
   INSERT USER
========================== */
$stmt = $conn->prepare(
  "INSERT INTO user_profile 
   (firstname, lastname, email, phone, dob, age, sex) 
   VALUES (?, ?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param(
  "sssssis",
  $data['firstname'],
  $data['lastname'],
  $data['email'],
  $data['phone'],
  $data['dob'],
  $data['age'],
  $data['sex']
);

if ($stmt->execute()) {
  echo json_encode([
    'success' => true,
    'message' => 'User created successfully'
  ]);
} else {
  echo json_encode([
    'success' => false,
    'message' => 'Failed to create user'
  ]);
}

$stmt->close();
$conn->close();
