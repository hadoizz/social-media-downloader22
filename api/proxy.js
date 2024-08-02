import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { Storage } from '@google-cloud/storage';

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

function generateUniqueFileName(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}.mp4`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    // Pipe the response to a file in Google Cloud Storage
    await new Promise((resolve, reject) => {
      const stream = response.body?.pipe(file.createWriteStream({
        metadata: {
          contentType,
        },
      }));
      stream?.on('finish', resolve);
      stream?.on('error', reject);
    });

    const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;

    // Redirect to the public URL of the video
    res.redirect(publicUrl);
  } catch (error) {
    console.error('Error proxying video:', error);
    res.status(500).send(`Error proxying video: ${(error as Error).message}`);
  }
}
