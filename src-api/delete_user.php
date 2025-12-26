<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$conn = new mysqli(
  "localhost",
  "root",
  "",
  "userdb"
);

if ($conn->connect_error) {
  echo json_encode(["success" => false]);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['id'])) {
  echo json_encode(["success" => false]);
  exit;
}

$stmt = $conn->prepare("DELETE FROM user_profile WHERE id = ?");
$stmt->bind_param("i", $data['id']);

echo json_encode([
  "success" => $stmt->execute()
]);

$stmt->close();
$conn->close();
