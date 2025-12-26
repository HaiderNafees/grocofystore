const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read products from data file
    const productsPath = path.join(process.cwd(), 'data', 'products.json');
    const productsData = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(productsData);

    // Return products as JSON
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error reading products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
