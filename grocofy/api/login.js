const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ success: false });
    }

    // Read users from data file
    const usersPath = path.join(process.cwd(), 'data', 'users.json');
    const usersData = fs.readFileSync(usersPath, 'utf8');
    const users = JSON.parse(usersData);

    // Find user with matching credentials
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      res.status(200).json({ success: true });
    } else {
      res.status(200).json({ success: false });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false });
  }
}
