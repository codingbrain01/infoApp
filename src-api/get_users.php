<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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

$result = $conn->query("SELECT id, firstname, lastname, email, phone, dob, age, sex FROM user_profile ORDER BY id DESC");

$users = [];

while ($row = $result->fetch_assoc()) {
  $users[] = $row;
}

echo json_encode([
  'success' => true,
  'data' => $users
]);

$conn->close();
