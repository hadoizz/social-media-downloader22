import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const file = req.files.file; // Assume file is sent in form-data
      const blob = bucket.file(file.name);
      const blobStream = blob.createWriteStream();

      blobStream.on('finish', () => {
        res.status(200).json({ message: 'File uploaded successfully!' });
      }).on('error', (err) => {
        res.status(500).json({ error: err.message });
      }).end(file.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload file' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
