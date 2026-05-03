import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // You'll create this CSS file

function App() {
  const [file1, setFile1] = useState('');
  const [file2, setFile2] = useState('');
  const [diffHTML, setDiffHTML] = useState('');
  const [error, setError] = useState('');

  const handleFile1Change = (event) => {
    setFile1(event.target.files[0]?.name || '');
  };

  const handleFile2Change = (event) => {
    setFile2(event.target.files[0]?.name || '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const formData = new FormData();
      formData.append('file1', file1);
      formData.append('file2', file2);

      const response = await axios.post('http://localhost:5000/compare', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setDiffHTML(response.data);
    } catch (err) {
      setError('Error comparing files: ' + (err.message || 'Unknown error'));
      console.error(err);
    }
  };

  return (
    <div className="App">
      <h1>File Comparison</h1>
      <section className="upload-section">
        <input
          type="file"
          id="file1"
          onChange={handleFile1Change}
          multiple
        />
        <input
          type="file"
          id="file2"
          onChange={handleFile2Change}
          multiple
        />
      </section>
      <section className="diff-section">
        {error && <div className="error">{error}</div>}
        <div className="diff-container">
          {diffHTML ? (
            <div className="diff" dangerouslySetInnerHTML={{ __html: diffHTML }}></div>
          ) : (
            <p>Upload files to compare.</p>
          )}
        </div>
      </section>
      <form onSubmit={handleSubmit}>
        <button type="submit">Compare</button>
      </form>
    </div>
  );
}

export default App;