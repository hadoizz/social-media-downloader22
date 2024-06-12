import React, { useState } from 'react'
import Layout from '../components/Layout'
import Form from '../components/Form'
import axios from 'axios'

export default function Home() {
  const [mediaData, setMediaData] = useState();
  const [loading, setLoading] = useState(false);

  const downloadMedia = async (e) => {
    e.preventDefault();
    const mediaUrl = e.target.mediaUrl.value;

    // verify if the url is empty
    if (!mediaUrl) {
      alert('Please enter a valid url');
      return;
    }

    // verify if the url is valid for facebook video, youtube video, instagram video, tiktok video
    if (!mediaUrl.includes('facebook') && !mediaUrl.includes('youtube') && !mediaUrl.includes('instagram') && !mediaUrl.includes('tiktok')) {
      alert('Please enter a valid url for facebook, youtube, instagram, tiktok');
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
      setMediaData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="text-center py-2 space-y-2 m-2">
        <h1 className="text-2xl md:text-4xl capitalize text-center text-bold bg-gradient-to-r from-rose-700 to-pink-600 bg-clip-text text-transparent"> Free Downloader from Facebook, Youtube, Instagram, Tiktok . </h1>
        <p className="text-sm md:text-lg text-center bg-gradient-to-r from-green-200 via-green-400 to-green-500 bg-clip-text text-transparent">Just paste the link and download the video you want.</p>
        <Form mediaDownload={downloadMedia} />
        
        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-rose-700"></div>
          </div>
        )}
        
        <div className="flex justify-center">
          {mediaData && (
            <video controls className="w-full md:w-6/12 max-h-80 rounded-md">
              <source src={mediaData?.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        <div className="flex justify-center">
          {mediaData && (
            <h2 className="text-2xl md:text-4xl capitalize text-center text-bold bg-gradient-to-r from-rose-700 to-pink-600 bg-clip-text text-transparent">{mediaData?.title}</h2>
          )}
        </div>

        <div className="flex justify-center space-x-3">
          {mediaData && mediaData.links.map((link, index) => (
            <a key={index} href={link.url} download className="bg-blue-500 text-white p-2 bg-gradient-to-r from-rose-700 to-pink-600">Download {link.quality}</a>
          ))}
        </div>
      </div>
    </Layout>
  )
}
