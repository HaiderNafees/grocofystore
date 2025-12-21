<?php
/**
 * Products API
 * Handles CRUD operations for products
 * 
 * Methods:
 * GET    - Get all products or specific product by ID
 * POST   - Create new product (admin only)
 * PUT    - Update product by ID (admin only)
 * DELETE - Delete product by ID (admin only)
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
$dataFile = '../data/products.json';

// Helper function to read JSON file
function readProducts() {
    global $dataFile;
    if (!file_exists($dataFile)) {
        return ['products' => []];
    }
    $json = file_get_contents($dataFile);
    return json_decode($json, true);
}

// Helper function to write JSON file
function writeProducts($data) {
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
    // In production, implement proper authentication
    // For now, we'll accept a simple header or parameter
    $headers = getallheaders();
    $role = $headers['X-User-Role'] ?? $_GET['role'] ?? $_POST['role'] ?? '';
    return $role === 'admin';
}

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            $products = readProducts();
            
            // Get specific product by ID
            if (isset($_GET['id'])) {
                $productId = $_GET['id'];
                $product = null;
                
                foreach ($products['products'] as $p) {
                    if ($p['id'] === $productId) {
                        $product = $p;
                        break;
                    }
                }
                
                if ($product) {
                    sendResponse($product);
                } else {
                    sendResponse(['error' => 'Product not found'], 404);
                }
            } else {
                // Return all products
                sendResponse($products);
            }
            break;
            
        case 'POST':
            // Create new product (admin only)
            if (!isAdmin()) {
                sendResponse(['error' => 'Admin access required'], 403);
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Validate required fields
            if (!isset($input['name']) || !isset($input['price']) || !isset($input['category'])) {
                sendResponse(['error' => 'Missing required fields: name, price, category'], 400);
            }
            
            $products = readProducts();
            
            // Generate unique ID
            $newId = 'product-' . time() . '-' . rand(1000, 9999);
            
            // Create new product
            $newProduct = [
                'id' => $newId,
                'name' => $input['name'],
                'price' => (float)$input['price'],
                'image' => $input['image'] ?? '',
                'category' => $input['category'],
                'stock' => (int)($input['stock'] ?? 0),
                'description' => $input['description'] ?? '',
                'isNew' => (bool)($input['isNew'] ?? false),
                'packOptions' => $input['packOptions'] ?? []
            ];
            
            $products['products'][] = $newProduct;
            
            if (writeProducts($products)) {
                sendResponse(['success' => true, 'product' => $newProduct], 201);
            } else {
                sendResponse(['error' => 'Failed to create product'], 500);
            }
            break;
            
        case 'PUT':
            // Update product (admin only)
            if (!isAdmin()) {
                sendResponse(['error' => 'Admin access required'], 403);
            }
            
            if (!isset($_GET['id'])) {
                sendResponse(['error' => 'Product ID required'], 400);
            }
            
            $productId = $_GET['id'];
            $input = json_decode(file_get_contents('php://input'), true);
            
            $products = readProducts();
            $productIndex = -1;
            
            // Find product index
            foreach ($products['products'] as $index => $p) {
                if ($p['id'] === $productId) {
                    $productIndex = $index;
                    break;
                }
            }
            
            if ($productIndex === -1) {
                sendResponse(['error' => 'Product not found'], 404);
            }
            
            // Update product fields
            $updatedProduct = $products['products'][$productIndex];
            
            if (isset($input['name'])) $updatedProduct['name'] = $input['name'];
            if (isset($input['price'])) $updatedProduct['price'] = (float)$input['price'];
            if (isset($input['image'])) $updatedProduct['image'] = $input['image'];
            if (isset($input['category'])) $updatedProduct['category'] = $input['category'];
            if (isset($input['stock'])) $updatedProduct['stock'] = (int)$input['stock'];
            if (isset($input['description'])) $updatedProduct['description'] = $input['description'];
            if (isset($input['isNew'])) $updatedProduct['isNew'] = (bool)$input['isNew'];
            if (isset($input['packOptions'])) $updatedProduct['packOptions'] = $input['packOptions'];
            
            $products['products'][$productIndex] = $updatedProduct;
            
            if (writeProducts($products)) {
                sendResponse(['success' => true, 'product' => $updatedProduct]);
            } else {
                sendResponse(['error' => 'Failed to update product'], 500);
            }
            break;
            
        case 'DELETE':
            // Delete product (admin only)
            if (!isAdmin()) {
                sendResponse(['error' => 'Admin access required'], 403);
            }
            
            if (!isset($_GET['id'])) {
                sendResponse(['error' => 'Product ID required'], 400);
            }
            
            $productId = $_GET['id'];
            $products = readProducts();
            
            // Find and remove product
            $found = false;
            foreach ($products['products'] as $index => $p) {
                if ($p['id'] === $productId) {
                    unset($products['products'][$index]);
                    $products['products'] = array_values($products['products']); // Re-index array
                    $found = true;
                    break;
                }
            }
            
            if (!$found) {
                sendResponse(['error' => 'Product not found'], 404);
            }
            
            if (writeProducts($products)) {
                sendResponse(['success' => true, 'message' => 'Product deleted successfully']);
            } else {
                sendResponse(['error' => 'Failed to delete product'], 500);
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
