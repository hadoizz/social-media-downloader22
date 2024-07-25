const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('URL query parameter is required');
  }

  try {
    // Validate the URL
    if (!isValidUrl(url)) {
      return res.status(400).send('Invalid URL');
    }

    const response = await axios.get(url, { responseType: 'stream' });

    // Set appropriate headers
    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Content-Length', response.headers['content-length']);

    response.data.pipe(res);
  } catch (error) {
    console.error('Error fetching the URL:', error.message); // Log the error for debugging
    res.status(500).send('Error fetching the URL');
  }
});

// Function to validate URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = router;
