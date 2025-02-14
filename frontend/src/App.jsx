import React, { useState, useEffect } from 'react';

const LanguageDetector = () => {
  const [inputText, setInputText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isServerHealthy, setIsServerHealthy] = useState(false);

  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        setIsServerHealthy(true);
      } else {
        setIsServerHealthy(false);
        setError('Server is not responding correctly');
      }
    } catch (error) {
      setIsServerHealthy(false);
      setError('Unable to connect to the server');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setDetectedLanguage(null);

    try {
      const response = await fetch('http://localhost:5000/api/detect-language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      const data = await response.json();
      setDetectedLanguage(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Error detecting language. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Language Detector</h1>
      {!isServerHealthy && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Server is not responding. Please check your backend.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-2 border rounded"
          rows="4"
          placeholder="Enter text to detect language"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isLoading || !isServerHealthy}
        >
          {isLoading ? 'Detecting...' : 'Detect Language'}
        </button>
      </form>
      {error && (
        <p className="text-red-500 mt-4">{error}</p>
      )}
      {detectedLanguage && (
        <div className="mt-4">
          <p>Detected Language: <strong>{detectedLanguage.language_name}</strong></p>
          <p>Language Code: <strong>{detectedLanguage.language_code}</strong></p>
        </div>
      )}
    </div>
  );
};

export default LanguageDetector;