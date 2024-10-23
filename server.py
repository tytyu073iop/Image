from flask import Flask, request, jsonify
from PIL import Image
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def get_bit_depth(mode):
    bit_depths = {
        '1': '1-bit',
        'L': '8-bit',
        'P': '8-bit',
        'RGB': '3x8-bit',
        'RGBA': '4x8-bit',
        'CMYK': '4x8-bit',
        'YCbCr': '3x8-bit',
        'LAB': '3x8-bit',
        'HSV': '3x8-bit',
        'I': '32-bit',
        'F': '32-bit'
    }
    
    return bit_depths.get(mode, 'Unknown mode')


@app.route('/process-images', methods=['POST'])
def process_images():
    print(1)
    if 'images' not in request.files:
        return jsonify({'error': 'No images part in the request'}), 400

    files = request.files.getlist('images')
    response = []

    for file in files:
        filename = file.filename
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        # os.makedirs(file_path, exist_ok=True)
        # file.save(file_path)

        with Image.open(file.stream) as img:
            width, height = img.size
            dpi = img.info.get('dpi')
            color_depth = img.mode
            compression = img.info.get('compression', 'N/A')

            response.append({
                'filename': filename,
                'width': width,
                'height': height,
                'dpi': int(dpi[0]) if dpi else 'N/A',
                'colorDepth': get_bit_depth(color_depth),
                'compression': compression
            })

    print(response)
    return jsonify(response)

app.run(debug=True, port=3000)
