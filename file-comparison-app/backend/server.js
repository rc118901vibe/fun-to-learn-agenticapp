const express = require('express');
const multer = require('multer');
const diff = require('diff');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/compare', upload.fields([{name: 'file1'}, {name: 'file2'}]), async (req, res) => {
  try {
    const file1Content = fs.readFileSync(req.files['file1'][0].path, 'utf8');
    const file2Content = fs.readFileSync(req.files['file2'][0].path, 'utf8');
    const diffResult = diff.createTwoFilesPatch('file1', 'file2', file1Content, file2Content);
    res.json({ diff: diffResult });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compare files' });
  }
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
