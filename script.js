document.addEventListener("DOMContentLoaded", () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const convertBtn = document.getElementById('convertBtn');
    const formatSelect = document.getElementById('formatSelect');
    
    let selectedFiles = [];

    const getFormatIcon = (format) => {
        const svgBase = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`;
        if (format.includes('pdf')) {
            return `${svgBase}<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`;
        }
        return `${svgBase}<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`;
    };

    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hiding');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    }

    if (dropZone) {
        dropZone.addEventListener('click', () => fileInput.click());
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });

        function handleFiles(files) {
            const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
            selectedFiles = [...selectedFiles, ...newFiles];
            updatePreview();
        }

        function updatePreview() {
            previewContainer.innerHTML = '';
            convertBtn.disabled = selectedFiles.length === 0;

            selectedFiles.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const div = document.createElement('div');
                    div.className = 'preview-item';
                    div.style.animationDelay = `${index * 0.1}s`;
                    div.innerHTML = `
                        <img src="${e.target.result}" alt="Preview">
                        <p>${file.name}</p>
                        <div class="icon-badge">${getFormatIcon(file.type)}</div>
                    `;
                    previewContainer.appendChild(div);
                };
                reader.readAsDataURL(file);
            });
        }

        convertBtn.addEventListener('click', async () => {
            const targetFormat = formatSelect.value;
            const originalText = convertBtn.textContent;
            
            convertBtn.classList.add('loading');
            convertBtn.innerHTML = `
                <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
                Memproses...
            `;
            convertBtn.disabled = true;

            try {
                if (targetFormat === 'application/pdf') {
                    await convertToPDF();
                } else {
                    await convertImages(targetFormat);
                }
                showToast("Berhasil! File telah diunduh.");
            } catch (error) {
                showToast("Terjadi kesalahan saat memproses file.");
                console.error(error);
            } finally {
                convertBtn.classList.remove('loading');
                convertBtn.textContent = originalText;
                convertBtn.disabled = false;
                selectedFiles = [];
                updatePreview();
            }
        });

        async function convertImages(format) {
            const ext = format.split('/')[1];
            
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const imageURL = await readFileAsDataURL(file);
                const convertedDataUrl = await processOnCanvas(imageURL, format);
                
                const originalName = file.name.split('.')[0];
                downloadFile(convertedDataUrl, `${originalName}_converted.${ext}`);
            }
        }

        async function convertToPDF() {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const imageURL = await readFileAsDataURL(file);
                const img = await loadImage(imageURL);
                
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                
                const ratio = Math.min(pdfWidth / img.width, pdfHeight / img.height);
                const finalWidth = img.width * ratio;
                const finalHeight = img.height * ratio;
                
                const x = (pdfWidth - finalWidth) / 2;
                const y = (pdfHeight - finalHeight) / 2;

                if (i > 0) pdf.addPage();
                
                const canvasDataURL = await processOnCanvas(imageURL, 'image/jpeg');
                pdf.addImage(canvasDataURL, 'JPEG', x, y, finalWidth, finalHeight);
            }
            
            pdf.save('Hasil_Gabungan_Masukanfilenya.pdf');
        }

        function readFileAsDataURL(file) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(file);
            });
        }

        function loadImage(src) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        }

        async function processOnCanvas(imageURL, format) {
            const img = await loadImage(imageURL);
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            
            if (format === 'image/jpeg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            ctx.drawImage(img, 0, 0);
            return canvas.toDataURL(format, 0.9);
        }

        function downloadFile(dataUrl, filename) {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    const sapaButton = document.getElementById('sapaButton');
    if (sapaButton) {
        sapaButton.addEventListener('click', () => {
            showToast('Halo! Saya Pandu Bittama Nurindra. Terima kasih sudah berkunjung dan mencoba konverter buatan saya. Mari belajar teknologi bersama!');
        });
    }
});
