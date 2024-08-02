// src/app/page.tsx (or .jsx)
import React, { useState } from 'react';
import Layout from '../components/Layout';
import Form from '../components/Form';
import axios from 'axios';

export default function Home() {
  const [mediaData, setMediaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const downloadMedia = async (e) => {
    e.preventDefault();
    const mediaUrl = e.target.mediaUrl.value;

    if (!mediaUrl) {
      alert('Please enter a valid URL');
      return;
    }

    const options = {
      method: 'GET',
      url: 'https://tweakball.com/wp-json/aio-dl/api/',
      params: {
        url: mediaUrl,
        key: '4355'
      }
    };

    setLoading(true);
    try {
      const response = await axios.request(options);
      console.log(response.data); // Log the response data to understand its structure
      setMediaData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching media:', error);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
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

        <div className="flex flex-wrap justify-center space-x-4">
          {mediaData && mediaData.medias && mediaData.medias.map((media, index) => (
            <div key={index} className="flex flex-col items-center my-4">
              <video controls className="w-full md:w-6/12 max-h-80 rounded-md mb-2">
                <source src={media.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="text-sm md:text-lg">{media.title}</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDownload(media.url, `video-${index}.mp4`)}
                  className="bg-blue-500 text-white p-2 rounded-md bg-gradient-to-r from-rose-700 to-pink-600"
                >
                  Download {media.quality}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
