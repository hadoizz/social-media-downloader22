import React, { useState } from 'react';
import Layout from '../components/Layout';
import Form from '../components/Form';
import axios from 'axios';

export default function Home() {
  const [mediaData, setMediaData] = useState(null);
  const [loading, setLoading] = useState(false);

  const downloadMedia = async (e) => {
    e.preventDefault();
    const mediaUrl = e.target.mediaUrl.value.trim();

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
      console.log(response.data);
      setMediaData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDownload = async (url, fileName) => {
    try {
      const response = await axios.get(url, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const blobUrl = URL.createObjectURL(blob);

      const anchorElement = document.createElement('a');
      anchorElement.href = blobUrl;
      anchorElement.download = fileName;
      anchorElement.style.display = 'none';
      document.body.appendChild(anchorElement);
      anchorElement.click();
      document.body.removeChild(anchorElement);

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading the file:', error);
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

        <div className="flex flex-col items-center space-y-4">
          {mediaData && mediaData.medias && mediaData.medias.map((media, index) => (
            <div key={index} className="mb-4">
              {media.type === 'video' && (
                <video controls className="w-full md:w-6/12 max-h-80 rounded-md">
                  <source src={media.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {media.type === 'image' && (
                <img src={media.url} alt={media.title} className="max-w-full max-h-80 rounded-md" />
              )}
              {media.type === 'audio' && (
                <audio controls className="w-full md:w-6/12">
                  <source src={media.url} type="audio/mp3" />
                  Your browser does not support the audio tag.
                </audio>
              )}
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => handleDownload(media.url, `media-${index}.${media.extension}`)}
                  className="bg-blue-500 text-white p-2 bg-gradient-to-r from-rose-700 to-pink-600"
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
