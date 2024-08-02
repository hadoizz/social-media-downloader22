// pages/api/generateSignedUrl.js
import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { fileName, contentType } = req.body;

    if (!fileName || !contentType) {
      return res.status(400).json({ error: 'File name and content type are required.' });
    }

    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: contentType,
    };

    try {
      const [url] = await bucket.file(fileName).getSignedUrl(options);
      res.status(200).json({ url });
    } catch (error) {
      res.status(500).json({ error: 'Error generating signed URL.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
