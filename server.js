const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/proxy', async (req, res) => {
  try {
    const { url } = req.query;
    const response = await axios.get(url, { responseType: 'stream' });
    response.data.pipe(res);
  } catch (error) {
    res.status(500).send('Error fetching the resource');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
