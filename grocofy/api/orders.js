export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get order data from request body
    const orderData = req.body;

    // Validate that we have some order data
    if (!orderData) {
      return res.status(400).json({ success: false, message: 'No order data provided' });
    }

    // Return mock response (storage will be added later)
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      success: true,
      message: "Order received (storage will be added later)"
    });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({
      success: false,
      message: "Failed to process order"
    });
  }
}
