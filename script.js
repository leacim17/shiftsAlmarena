 class FileUploader {
            constructor() {
                this.files = {
                    breakfast: null,
                    shifts: null
                };
                this.init();
            }

            init() {
                this.setupDropZones();
                this.setupSubmitButton();
            }

            setupDropZones() {
                const zones = [
                    { zone: 'breakfast-zone', input: 'breakfast-input', key: 'breakfast' },
                    { zone: 'shifts-zone', input: 'shifts-input', key: 'shifts' }
                ];

                zones.forEach(({ zone, input, key }) => {
                    const dropZone = document.getElementById(zone);
                    const fileInput = document.getElementById(input);

                    // Click to select file
                    dropZone.addEventListener('click', () => fileInput.click());

                    // File input change
                    fileInput.addEventListener('change', (e) => {
                        if (e.target.files.length > 0) {
                            this.handleFile(e.target.files[0], dropZone, key);
                        }
                    });

                    // Drag and drop events
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
                        
                        if (e.dataTransfer.files.length > 0) {
                            this.handleFile(e.dataTransfer.files[0], dropZone, key);
                        }
                    });
                });
            }

            handleFile(file, dropZone, key) {
                this.files[key] = file;
                
                // Update UI
                dropZone.classList.add('has-file');
                const textElement = dropZone.querySelector('.drop-zone-text');
                textElement.textContent = `✓ ${file.name}`;
                
                // Add animation
                dropZone.style.animation = 'pulse 0.3s ease-out';
                setTimeout(() => {
                    dropZone.style.animation = '';
                }, 300);

                this.updateSubmitButton();
            }

            updateSubmitButton() {
                const submitBtn = document.getElementById('submit-btn');
                const hasFiles = this.files.breakfast || this.files.shifts;
                
                submitBtn.disabled = !hasFiles;
                submitBtn.style.opacity = hasFiles ? '1' : '0.5';
            }

            setupSubmitButton() {
                const submitBtn = document.getElementById('submit-btn');
                
                submitBtn.addEventListener('click', () => {
                    if (this.files.breakfast || this.files.shifts) {
                        this.submitFiles();
                    }
                });
            }

            async submitFiles() {
                const submitBtn = document.getElementById('submit-btn');
                const btnText = submitBtn.querySelector('.btn-text');
                const loading = submitBtn.querySelector('.loading');
                const successMessage = document.getElementById('success-message');

                // Show loading state
                btnText.style.display = 'none';
                loading.style.display = 'flex';
                submitBtn.disabled = true;

                try {
                    // Simulate API call - replace with your actual API endpoint
                    const formData = new FormData();
                    
                    if (this.files.breakfast) {
                        formData.append('reporte', this.files.breakfast);
                    }
                    
                    if (this.files.shifts) {
                        formData.append('turnos', this.files.shifts);
                    }

                    // Replace 'YOUR_API_ENDPOINT' with your actual API URL
                    const response = await fetch('http://127.0.0.1:3000/uploads', {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) throw new Error("Error en la respuesta");

                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);


                    // Crear link temporal y simular click
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "Turnos_Desayunos.xlsx"; // nombre sugerido
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);

                    // Simulate API delay
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    // Show success
                    successMessage.style.display = 'block';
                    
                    // Reset form after success
                    setTimeout(() => {
                        this.resetForm();
                    }, 2000);

                } catch (error) {
                    console.error('Error uploading files:', error);
                    alert('Error al enviar los archivos. Por favor, intenta nuevamente.');
                } finally {
                    // Reset button state
                    btnText.style.display = 'inline';
                    loading.style.display = 'none';
                    submitBtn.disabled = false;
                }
            }

            resetForm() {
                // Reset files
                this.files = { breakfast: null, shifts: null };
                
                // Reset UI
                const zones = document.querySelectorAll('.drop-zone');
                zones.forEach(zone => {
                    zone.classList.remove('has-file');
                    const textElement = zone.querySelector('.drop-zone-text');
                    textElement.textContent = 'Arrastra tu archivo aquí o haz clic para seleccionar';
                });

                // Reset inputs
                document.getElementById('breakfast-input').value = '';
                document.getElementById('shifts-input').value = '';

                // Hide success message
                document.getElementById('success-message').style.display = 'none';

                this.updateSubmitButton();
            }
        }

        // Initialize the uploader when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            new FileUploader();
        });