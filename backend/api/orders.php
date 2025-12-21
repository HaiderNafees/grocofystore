<?php
/**
 * Orders API
 * Handles CRUD operations for orders
 * 
 * Methods:
 * GET    - Get all orders or specific order by ID
 * POST   - Create new order
 * PUT    - Update order status (admin only)
 * DELETE - Delete order by ID (admin only)
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
$dataFile = '../data/orders.json';

// Helper function to read JSON file
function readOrders() {
    global $dataFile;
    if (!file_exists($dataFile)) {
        return ['orders' => []];
    }
    $json = file_get_contents($dataFile);
    return json_decode($json, true);
}

// Helper function to write JSON file
function writeOrders($data) {
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
            $orders = readOrders();
            
            // Get specific order by ID
            if (isset($_GET['id'])) {
                $orderId = $_GET['id'];
                $order = null;
                
                foreach ($orders['orders'] as $o) {
                    if ($o['id'] === $orderId) {
                        $order = $o;
                        break;
                    }
                }
                
                if ($order) {
                    sendResponse($order);
                } else {
                    sendResponse(['error' => 'Order not found'], 404);
                }
            } else {
                // Return all orders (admin can see all, users see their own)
                $userEmail = $_GET['user_email'] ?? '';
                
                if ($userEmail && !isAdmin()) {
                    // Filter orders by user email
                    $userOrders = array_filter($orders['orders'], function($order) use ($userEmail) {
                        return isset($order['customer']['email']) && $order['customer']['email'] === $userEmail;
                    });
                    sendResponse(['orders' => array_values($userOrders)]);
                } else {
                    sendResponse($orders);
                }
            }
            break;
            
        case 'POST':
            // Create new order
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Validate required fields
            if (!isset($input['products']) || !isset($input['customer']) || !isset($input['total'])) {
                sendResponse(['error' => 'Missing required fields: products, customer, total'], 400);
            }
            
            // Validate products array
            if (empty($input['products']) || !is_array($input['products'])) {
                sendResponse(['error' => 'Products array is required and cannot be empty'], 400);
            }
            
            // Validate customer info
            $requiredCustomerFields = ['name', 'email', 'phone', 'address'];
            foreach ($requiredCustomerFields as $field) {
                if (!isset($input['customer'][$field]) || empty($input['customer'][$field])) {
                    sendResponse(['error' => "Missing required customer field: $field"], 400);
                }
            }
            
            $orders = readOrders();
            
            // Generate unique ID
            $newId = 'order-' . time() . '-' . rand(1000, 9999);
            $now = date('c'); // ISO 8601 date format
            
            // Create new order
            $newOrder = [
                'id' => $newId,
                'products' => $input['products'],
                'total' => (float)$input['total'],
                'customer' => $input['customer'],
                'status' => 'pending',
                'createdAt' => $now,
                'updatedAt' => $now
            ];
            
            $orders['orders'][] = $newOrder;
            
            if (writeOrders($orders)) {
                sendResponse(['success' => true, 'order' => $newOrder], 201);
            } else {
                sendResponse(['error' => 'Failed to create order'], 500);
            }
            break;
            
        case 'PUT':
            // Update order (admin only)
            if (!isAdmin()) {
                sendResponse(['error' => 'Admin access required'], 403);
            }
            
            if (!isset($_GET['id'])) {
                sendResponse(['error' => 'Order ID required'], 400);
            }
            
            $orderId = $_GET['id'];
            $input = json_decode(file_get_contents('php://input'), true);
            
            $orders = readOrders();
            $orderIndex = -1;
            
            // Find order index
            foreach ($orders['orders'] as $index => $o) {
                if ($o['id'] === $orderId) {
                    $orderIndex = $index;
                    break;
                }
            }
            
            if ($orderIndex === -1) {
                sendResponse(['error' => 'Order not found'], 404);
            }
            
            // Update order fields
            $updatedOrder = $orders['orders'][$orderIndex];
            
            if (isset($input['status'])) {
                $validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
                if (!in_array($input['status'], $validStatuses)) {
                    sendResponse(['error' => 'Invalid status. Valid statuses: ' . implode(', ', $validStatuses)], 400);
                }
                $updatedOrder['status'] = $input['status'];
            }
            
            if (isset($input['products'])) $updatedOrder['products'] = $input['products'];
            if (isset($input['total'])) $updatedOrder['total'] = (float)$input['total'];
            if (isset($input['customer'])) $updatedOrder['customer'] = $input['customer'];
            
            $updatedOrder['updatedAt'] = date('c');
            
            $orders['orders'][$orderIndex] = $updatedOrder;
            
            if (writeOrders($orders)) {
                sendResponse(['success' => true, 'order' => $updatedOrder]);
            } else {
                sendResponse(['error' => 'Failed to update order'], 500);
            }
            break;
            
        case 'DELETE':
            // Delete order (admin only)
            if (!isAdmin()) {
                sendResponse(['error' => 'Admin access required'], 403);
            }
            
            if (!isset($_GET['id'])) {
                sendResponse(['error' => 'Order ID required'], 400);
            }
            
            $orderId = $_GET['id'];
            $orders = readOrders();
            
            // Find and remove order
            $found = false;
            foreach ($orders['orders'] as $index => $o) {
                if ($o['id'] === $orderId) {
                    unset($orders['orders'][$index]);
                    $orders['orders'] = array_values($orders['orders']); // Re-index array
                    $found = true;
                    break;
                }
            }
            
            if (!$found) {
                sendResponse(['error' => 'Order not found'], 404);
            }
            
            if (writeOrders($orders)) {
                sendResponse(['success' => true, 'message' => 'Order deleted successfully']);
            } else {
                sendResponse(['error' => 'Failed to delete order'], 500);
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
