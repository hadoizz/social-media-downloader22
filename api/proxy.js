import React from 'react';
import axios from 'axios';

const MediaDownloader = ({ mediaUrl, fileName }) => {
  const handleDownload = async () => {
    try {
      const response = await axios.get('/api/proxy', {
        params: { url: mediaUrl },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const blobUrl = URL.createObjectURL(blob);

      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <button onClick={handleDownload}>Download</button>
  );
};

export default MediaDownloader;
