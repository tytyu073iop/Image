document.addEventListener('DOMContentLoaded', () => {
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const imageTable = document.getElementById('imageTable').getElementsByTagName('tbody')[0];

    uploadBtn.addEventListener('click', () => {
        const files = fileInput.files;

        if (!files.length) {
            alert('Please select a folder with images.');
            return;
        }

        const formData = new FormData();
        
        // Append files to the form data
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }

        // Send files to server for processing (Assuming a Python/Node.js backend)
        console.log('ver3000')
        fetch('http://localhost:3000/process-images', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Clear the table before appending new data
            imageTable.innerHTML = '';

            let i = 1;

            // Populate the table with image metadata
            data.forEach(image => {
                const row = imageTable.insertRow();
                row.insertCell(0).textContent = i;
                row.insertCell(1).textContent = image.filename;
                row.insertCell(2).textContent = `${image.width} x ${image.height}`;
                row.insertCell(3).textContent = image.dpi || 'N/A';
                row.insertCell(4).textContent = image.colorDepth || 'N/A';
                row.insertCell(5).textContent = image.compression || 'N/A';

                i++;
            });
        })
        .catch(err => {
            console.error('Error processing images:', err);
            alert('An error occurred while processing the images.');
        });
    });
});
