const fileUpload = document.getElementById('file-upload');
const fileNames = document.getElementById('file-names');

fileUpload.addEventListener('change', (e) => {
    const files = e.target.files;
    for (const file of files) {
        const p = document.createElement('p');
        p.classList.add('text-muted', 'mb-0');
        const content = document.createTextNode(file.name);
        p.appendChild(content);
        fileNames.appendChild(p);
    }
});