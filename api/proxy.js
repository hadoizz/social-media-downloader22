// pages/api/proxy.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { url } = req.query;
      const response = await axios.get(url, { responseType: 'stream' });
      response.data.pipe(res);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching the resource', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
