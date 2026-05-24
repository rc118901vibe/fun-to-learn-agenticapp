import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [diffHTML, setDiffHTML] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const formData = new FormData();
      formData.append('file1', file1);
      formData.append('file2', file2);
      const response = await axios.post('http://localhost:5000/compare', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setDiffHTML(response.data.diffHTML);
    } catch (err) {
      setError('Error comparing files: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>File Comparison App</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>File 1: </label>
          <input type="file" onChange={e => setFile1(e.target.files[0])} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>File 2: </label>
          <input type="file" onChange={e => setFile2(e.target.files[0])} />
        </div>
        <button type="submit">Compare Files</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {diffHTML && (
        <div
          style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}
          dangerouslySetInnerHTML={{ __html: diffHTML }}
        />
      )}
    </div>
  );
}

export default App;
