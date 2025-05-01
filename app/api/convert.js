// pages/api/convert.js

import formidable from 'formidable';
import fs from 'fs';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const data = fs.readFileSync(file.filepath);
    const pngBuffer = await sharp(data).png().toBuffer();

    res.setHeader('Content-Type', 'image/png');
    res.send(pngBuffer);
  });
}
