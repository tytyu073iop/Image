const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const gm = require('gm').subClass({ imageMagick: '7+' }); // Ensure GraphicsMagick usage

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
            const image = gm(file.buffer);

            // Get image dimensions using identify command
            const identify = await new Promise((resolve, reject) => {
                return image.identify((err, value) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(value);
                    }
                });
            });

            const { width, height } = identify.Geometry;
            const dpi = identify.density ? identify.density : 'N/A';

            // Assuming 8-bit depth per channel for now
            const colorDepth = (identify.bits ? identify.bits : 8) + '-bit';

            // Format is available directly from identify output
            const compression = identify.format;

            imageData.push({
                filename: file.originalname,
                width,
                height,
                dpi,
                colorDepth,
                compression,
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
