// api/proxy.js
import axios from 'axios';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer', // or 'blob' if you're dealing with large files
    });

    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Content-Length', response.headers['content-length']);
    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
