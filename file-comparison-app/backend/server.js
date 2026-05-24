const express = require('express');
const multer = require('multer');
const diff = require('diff');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/compare', upload.fields([{ name: 'file1' }, { name: 'file2' }]), async (req, res) => {
  try {
    const file1Content = fs.readFileSync(req.files['file1'][0].path, 'utf8');
    const file2Content = fs.readFileSync(req.files['file2'][0].path, 'utf8');

    const diffResult = diff.diffLines(file1Content, file2Content);

    let diffHTML = '<pre style="font-family:monospace">';
    diffResult.forEach(part => {
      const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
      const symbol = part.added ? '+ ' : part.removed ? '- ' : '  ';
      diffHTML += `<span style="color:${color}">${symbol}${part.value}</span>`;
    });
    diffHTML += '</pre>';

    res.json({ diffHTML });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compare files' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
