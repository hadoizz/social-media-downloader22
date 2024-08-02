const fetch = require('node-fetch');
const { Storage } = require('@google-cloud/storage');

const PROJECT_ID = process.env.PROJECT_ID;
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const PRIVATE_KEY = process.env.PRIVATE_KEY?.replace(/\\n/g, '\n');
const BUCKET_NAME = process.env.BUCKET_NAME || 'your-default-bucket-name'; // Provide a default value here

if (!PROJECT_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
  throw new Error('Missing required environment variables');
}

const storage = new Storage({
  projectId: PROJECT_ID,
  credentials: {
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
  },
});

function generateUniqueFileName() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}.mp4`;
}

module.exports = async function handler(req, res) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    res.status(400).send('URL parameter is required.');
    return;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
    const fileName = generateUniqueFileName();
    const file = storage.bucket(BUCKET_NAME).file(fileName);

    const writeStream = file.createWriteStream({
      metadata: {
        contentType,
      },
    });

    response.body.pipe(writeStream);

    writeStream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;
      res.status(200).json({ url: publicUrl });
    });

    writeStream.on('error', (err) => {
      console.error('Error writing to Google Cloud Storage:', err);
      res.status(500).send(`Error writing to Google Cloud Storage: ${err.message}`);
    });

  } catch (error) {
    console.error('Error proxying video:', error);
    res.status(500).send(`Error proxying video: ${(error.message)}`);
  }
};
