// pages/InstagramReels.jsx

import React, { useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

export default function InstagramReels() {
  const [reelsData, setReelsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');

  const fetchReels = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://instagram-bulk-profile-scrapper.p.rapidapi.com/clients/api/ig/media_by_id', {
        params: {
          shortcode: extractShortcode(url), // Extract shortcode from the provided URL
          response_type: 'reels'
        },
        headers: {
          'x-rapidapi-key': process.env.NEXT_PUBLIC_INSTAGRAM_API_KEY, // Replace with your Instagram API key
          'x-rapidapi-host': 'instagram-bulk-profile-scrapper.p.rapidapi.com'
        }
      });
      setReelsData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reels:', error);
      setLoading(false);
    }
  };

  const extractShortcode = (url) => {
    const regex = /\/reel\/([A-Za-z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReels();
  };

  return (
    <Layout>
      <div className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold text-center mb-4">Instagram Reels Downloader</h1>
        <form onSubmit={handleSubmit} className="flex items-center justify-center mb-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter Instagram Reels URL"
            className="border border-gray-300 px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md ml-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Fetch Reels
          </button>
        </form>

        {loading && <p className="text-center">Loading...</p>}

        {reelsData && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Reels Information:</h2>
            <p><strong>Shortcode:</strong> {reelsData.shortcode}</p>
            <p><strong>Thumbnail:</strong> <img src={reelsData.thumbnail} alt="Reels Thumbnail" className="max-w-full h-auto" /></p>
            <p><strong>Video URL:</strong> <a href={reelsData.video_url} target="_blank" rel="noopener noreferrer">{reelsData.video_url}</a></p>
          </div>
        )}
      </div>
    </Layout>
  );
}

