import React, { useState } from 'react';
import Layout from '../components/Layout';
import Form from '../components/Form';
import axios from 'axios';

export default function InstagramReels() {
  const [reelData, setReelData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReelData = async (e) => {
    e.preventDefault();
    const reelUrl = e.target.reelUrl.value;

    // Verify if the url is empty
    if (!reelUrl) {
      alert('Please enter a valid Instagram Reel URL');
      return;
    }

    const options = {
      method: 'GET',
      url: 'https://instagram-bulk-profile-scrapper.p.rapidapi.com/clients/api/ig/media_by_id',
      params: {
        shortcode: extractShortcodeFromUrl(reelUrl),
        response_type: 'reels'
      },
      headers: {
        'x-rapidapi-key': '61f99d3e77msh61688cbb09796b4p18b365jsn09c26ce3e5c4',
        'x-rapidapi-host': 'instagram-bulk-profile-scrapper.p.rapidapi.com'
      }
    };

    setLoading(true);
    try {
      const response = await axios.request(options);
      console.log(response.data); // Log the response data to understand its structure
      setReelData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Instagram Reel:', error);
      setLoading(false);
    }
  };

  // Function to extract shortcode from Instagram Reel URL
  const extractShortcodeFromUrl = (url) => {
    const match = url.match(/\/reel\/([^\/?#]+)/);
    return match ? match[1] : null;
  };

  return (
    <Layout>
      <div className="text-center py-2 space-y-2 m-2">
        <h1 className="text-2xl md:text-4xl capitalize text-center text-bold bg-gradient-to-r from-rose-700 to-pink-600 bg-clip-text text-transparent">
          Instagram Reel Downloader
        </h1>
        <p className="text-sm md:text-lg text-center bg-gradient-to-r from-green-200 via-green-400 to-green-500 bg-clip-text text-transparent">
          Enter an Instagram Reel URL to fetch and download the reel.
        </p>
        <Form onSubmit={fetchReelData} buttonText="Fetch Reel" inputPlaceholder="Enter Reel URL" />
        
        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-rose-700"></div>
          </div>
        )}
        
        <div className="flex justify-center">
          {reelData && reelData.media_url && (
            <video controls className="w-full md:w-6/12 max-h-80 rounded-md">
              <source src={reelData.media_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        <div className="flex justify-center">
          {reelData && reelData.caption && (
            <h2 className="text-2xl md:text-4xl capitalize text-center text-bold bg-gradient-to-r from-rose-700 to-pink-600 bg-clip-text text-transparent">
              {reelData.caption}
            </h2>
          )}
        </div>

        <div className="flex justify-center space-x-3">
          {reelData && reelData.media_url && (
            <button 
              onClick={() => handleDownload(reelData.media_url, 'reel-video.mp4')}
              className="bg-blue-500 text-white p-2 bg-gradient-to-r from-rose-700 to-pink-600"
            >
              Download Reel
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
