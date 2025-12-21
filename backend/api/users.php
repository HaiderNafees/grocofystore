<?php
/**
 * Users API
 * Handles user authentication and user management
 * 
 * Methods:
 * GET    - Get all users (admin only)
 * POST   - Login or create new user
 * PUT    - Update user (admin only)
 * DELETE - Delete user (admin only)
 */

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Data file path
$dataFile = '../data/users.json';

// Helper function to read JSON file
function readUsers() {
    global $dataFile;
    if (!file_exists($dataFile)) {
        return ['users' => []];
    }
    $json = file_get_contents($dataFile);
    return json_decode($json, true);
}

// Helper function to write JSON file
function writeUsers($data) {
    global $dataFile;
    $json = json_encode($data, JSON_PRETTY_PRINT);
    return file_put_contents($dataFile, $json);
}

// Helper function to send JSON response
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

// Helper function to validate admin (simple check)
function isAdmin() {
    $headers = getallheaders();
    $role = $headers['X-User-Role'] ?? $_GET['role'] ?? $_POST['role'] ?? '';
    return $role === 'admin';
}

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Get all users (admin only)
            if (!isAdmin()) {
                sendResponse(['error' => 'Admin access required'], 403);
            }
            
            $users = readUsers();
            
            // Remove passwords from response for security
            $safeUsers = array_map(function($user) {
                $safeUser = $user;
                unset($safeUser['password']);
                return $safeUser;
            }, $users['users']);
            
            sendResponse(['users' => $safeUsers]);
            break;
            
        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Check if this is a login request
            if (isset($input['action']) && $input['action'] === 'login') {
                // Login functionality
                if (!isset($input['email']) || !isset($input['password'])) {
                    sendResponse(['error' => 'Email and password required'], 400);
                }
                
                $email = $input['email'];
                $password = $input['password'];
                
                $users = readUsers();
                $user = null;
                
                // Find user by email
                foreach ($users['users'] as $u) {
                    if ($u['email'] === $email) {
                        $user = $u;
                        break;
                    }
                }
                
                if (!$user) {
                    sendResponse(['error' => 'User not found'], 404);
                }
                
                // Verify password (plain text comparison for now)
                if ($user['password'] !== $password) {
                    sendResponse(['error' => 'Invalid password'], 401);
                }
                
                // Remove password from response
                $safeUser = $user;
                unset($safeUser['password']);
                
                sendResponse([
                    'success' => true,
                    'user' => $safeUser,
                    'message' => 'Login successful'
                ]);
                
            } else {
                // Create new user
                if (!isAdmin()) {
                    sendResponse(['error' => 'Admin access required to create users'], 403);
                }
                
                // Validate required fields
                if (!isset($input['email']) || !isset($input['password']) || !isset($input['role'])) {
                    sendResponse(['error' => 'Missing required fields: email, password, role'], 400);
                }
                
                // Validate role
                $validRoles = ['user', 'admin'];
                if (!in_array($input['role'], $validRoles)) {
                    sendResponse(['error' => 'Invalid role. Valid roles: ' . implode(', ', $validRoles)], 400);
                }
                
                $users = readUsers();
                
                // Check if email already exists
                foreach ($users['users'] as $u) {
                    if ($u['email'] === $input['email']) {
                        sendResponse(['error' => 'Email already exists'], 409);
                    }
                }
                
                // Generate unique ID
                $newId = 'user-' . time() . '-' . rand(1000, 9999);
                
                // Create new user
                $newUser = [
                    'id' => $newId,
                    'email' => $input['email'],
                    'password' => $input['password'], // Plain text for now (upgrade to hashing later)
                    'role' => $input['role'],
                    'name' => $input['name'] ?? '',
                    'createdAt' => date('c')
                ];
                
                $users['users'][] = $newUser;
                
                if (writeUsers($users)) {
                    // Remove password from response
                    $safeUser = $newUser;
                    unset($safeUser['password']);
                    
                    sendResponse(['success' => true, 'user' => $safeUser], 201);
                } else {
                    sendResponse(['error' => 'Failed to create user'], 500);
                }
            }
            break;
            
        case 'PUT':
            // Update user (admin only)
            if (!isAdmin()) {
                sendResponse(['error' => 'Admin access required'], 403);
            }
            
            if (!isset($_GET['id'])) {
                sendResponse(['error' => 'User ID required'], 400);
            }
            
            $userId = $_GET['id'];
            $input = json_decode(file_get_contents('php://input'), true);
            
            $users = readUsers();
            $userIndex = -1;
            
            // Find user index
            foreach ($users['users'] as $index => $u) {
                if ($u['id'] === $userId) {
                    $userIndex = $index;
                    break;
                }
            }
            
            if ($userIndex === -1) {
                sendResponse(['error' => 'User not found'], 404);
            }
            
            // Update user fields
            $updatedUser = $users['users'][$userIndex];
            
            if (isset($input['email'])) {
                // Check if new email already exists (excluding current user)
                foreach ($users['users'] as $index => $u) {
                    if ($u['email'] === $input['email'] && $index !== $userIndex) {
                        sendResponse(['error' => 'Email already exists'], 409);
                    }
                }
                $updatedUser['email'] = $input['email'];
            }
            
            if (isset($input['password'])) $updatedUser['password'] = $input['password'];
            if (isset($input['role'])) {
                $validRoles = ['user', 'admin'];
                if (!in_array($input['role'], $validRoles)) {
                    sendResponse(['error' => 'Invalid role. Valid roles: ' . implode(', ', $validRoles)], 400);
                }
                $updatedUser['role'] = $input['role'];
            }
            if (isset($input['name'])) $updatedUser['name'] = $input['name'];
            
            $users['users'][$userIndex] = $updatedUser;
            
            if (writeUsers($users)) {
                // Remove password from response
                $safeUser = $updatedUser;
                unset($safeUser['password']);
                
                sendResponse(['success' => true, 'user' => $safeUser]);
            } else {
                sendResponse(['error' => 'Failed to update user'], 500);
            }
            break;
            
        case 'DELETE':
            // Delete user (admin only)
            if (!isAdmin()) {
                sendResponse(['error' => 'Admin access required'], 403);
            }
            
            if (!isset($_GET['id'])) {
                sendResponse(['error' => 'User ID required'], 400);
            }
            
            $userId = $_GET['id'];
            $users = readUsers();
            
            // Find and remove user
            $found = false;
            foreach ($users['users'] as $index => $u) {
                if ($u['id'] === $userId) {
                    unset($users['users'][$index]);
                    $users['users'] = array_values($users['users']); // Re-index array
                    $found = true;
                    break;
                }
            }
            
            if (!$found) {
                sendResponse(['error' => 'User not found'], 404);
            }
            
            if (writeUsers($users)) {
                sendResponse(['success' => true, 'message' => 'User deleted successfully']);
            } else {
                sendResponse(['error' => 'Failed to delete user'], 500);
            }
            break;
            
        default:
            sendResponse(['error' => 'Method not allowed'], 405);
            break;
    }
} catch (Exception $e) {
    sendResponse(['error' => 'Internal server error: ' . $e->getMessage()], 500);
}
?>
