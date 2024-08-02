// api/proxy.js
import axios from 'axios';

export default async function handler(req, res) {
  const { url } = req.query;

  try {
    const response = await axios.get(url, { responseType: 'stream' });
    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching the resource', error: error.message });
  }
}
