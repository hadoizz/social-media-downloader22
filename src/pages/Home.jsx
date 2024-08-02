import React, { useState } from 'react';
import Layout from '../components/Layout';
import Form from '../components/Form';
import axios from 'axios';

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const getSignedUrl = async (file) => {
    try {
      const response = await axios.post('/api/upload', {
        fileName: file.name,
        contentType: file.type,
      });
      return response.data.url;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      return null;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    const signedUrl = await getSignedUrl(file);
    if (!signedUrl) {
      setLoading(false);
      alert('Failed to get signed URL.');
      return;
    }

    try {
      await axios.put(signedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="text-center py-2 space-y-2 m-2">
        <h1 className="text-2xl md:text-4xl capitalize text-center text-bold bg-gradient-to-r from-rose-700 to-pink-600 bg-clip-text text-transparent">
          Free Downloader from Facebook, Youtube, Instagram, Tiktok.
        </h1>
        <p className="text-sm md:text-lg text-center bg-gradient-to-r from-green-200 via-green-400 to-green-500 bg-clip-text text-transparent">
          Just paste the link and download the media you want.
        </p>
        <Form mediaDownload={downloadMedia} />

        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-rose-700"></div>
          </div>
        )}

        <form onSubmit={handleUpload} className="flex flex-col items-center my-4">
          <input type="file" onChange={handleFileChange} />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md bg-gradient-to-r from-rose-700 to-pink-600">
            Upload File
          </button>
        </form>

        {/* Your other UI elements */}
      </div>
    </Layout>
  );
}
