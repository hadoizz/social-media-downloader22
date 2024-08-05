import React from 'react';
import axios from 'axios';

const MediaDownloader = ({ mediaUrl, fileName }) => {
  const handleDownload = async () => {
    try {
      // Call the proxy API to get the file URL
      const response = await axios.get('/api/proxy', {
        params: { url: mediaUrl },
        responseType: 'json', // Expect JSON response containing the download URL
      });

      const downloadUrl = response.data.url;
      if (!downloadUrl) {
        throw new Error('Failed to get download URL');
      }

      // Fetch the file from the download URL
      const downloadResponse = await axios.get(downloadUrl, {
        responseType: 'blob', // Expect binary data
      });

      // Create a blob and trigger the file download
      const blob = new Blob([downloadResponse.data], { type: downloadResponse.headers['content-type'] });
      const blobUrl = URL.createObjectURL(blob);

      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  return (
    <button onClick={handleDownload}>Download</button>
  );
};

export default MediaDownloader;
