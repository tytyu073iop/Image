const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');

const app = express();
const upload = multer();

app.use(cors());

app.post('/process-images', upload.array('images'), async (req, res) => {
    const imageData = [];

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No images provided' });
    }

    for (const file of req.files) {
        try {
            const image = sharp(file.buffer);
            const metadata = await image.metadata();

            imageData.push({
                filename: file.originalname,
                width: metadata.width,
                height: metadata.height,
                dpi: metadata.density || 'N/A',
                colorDepth: metadata.channels * 8 + '-bit', // Assuming each channel is 8-bit
                compression: metadata.format || 'N/A',
            });
        } catch (err) {
            console.error(`Error processing image ${file.originalname}:`, err);
        }
    }

    res.json(imageData);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
