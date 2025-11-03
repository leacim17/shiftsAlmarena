 class FileUploader {
            constructor() {
                this.files = {
                    breakfast: null,
                    shifts: null
                }, 
                this.fechaInicio;
                this.init();
            }

            init() {
                this.setupDropZones();
                this.setupSubmitButton();
                this.setupDownloadButton();
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
                const downloadBtn = document.getElementById('download-btn');
                submitBtn.addEventListener('click', (e) => {
                     e.preventDefault();
                     downloadBtn.removeAttribute('disabled');
                    if (this.files.breakfast || this.files.shifts) {
                        this.submitFiles(); 
                    }
                });
            }

            setupDownloadButton() {
                const downloadBtn = document.getElementById('download-btn');
                downloadBtn.addEventListener('click', () => {
                        this.downloadFiles();
                });
            }

            showAlert(type, time, message) {
                const alertContainer = document.getElementById('alert-container');
                const alert = document.getElementById('alert');
                const alertIcon = document.getElementById('alert-icon');
                const alertMessage = document.getElementById('alert-message');

                // Limpiar clases previas
                alert.classList.remove('alert-error', 'alert-warning', 'alert-success');

                // Configurar según el tipo
                switch (type){
                    case "error": 
                        alert.classList.add('alert-error');
                        alertIcon.textContent = '❌​';
                        break;
                    case "warning":
                        alert.classList.add('alert-warning');
                        alertIcon.textContent = '⚠️​';
                        break;
                    case "success":
                        alert.classList.add('alert-success');
                        alertIcon.textContent = '✅​';
                        break;
                    default: 
                        alert.classList.add('alert-error');
                        alertIcon.textContent = '❌​';
                        break;

                }

                alertMessage.textContent = message;
                alertContainer.style.display = 'block';

                // Auto-ocultar después de 5 segundos
                setTimeout(() => {
                    alertContainer.style.display = 'none';
                }, time);
            }

            async submitFiles() {
                const submitBtn = document.getElementById('submit-btn');
                const btnText = submitBtn.querySelector('.btn-text');
                const loading = submitBtn.querySelector('.loading');
                const successMessage = document.getElementById('success-message');

                // Show loading state
                btnText.style.display = 'none';
                loading.style.display = 'flex';

                try {
                    // Simulate API call - replace with your actual API endpoint
                    const formData = new FormData();
                    
                    if (this.files.breakfast) {
                        formData.append('reporte', this.files.breakfast);
                    }
                    
                    if (this.files.shifts) {
                        formData.append('turnos', this.files.shifts);
                    }

                    const dateInput = document.getElementById('report-date');
                    formData.append('fechaInicio', dateInput.value);

                    // Replace with your actual API URL
                    
                    const res = await fetch('https://turnosdesayuno.onrender.com/uploads', {
                        method: 'POST',
                        body: formData
                    });
                    /*
                    const res = await fetch('http://127.0.0.1:3000/uploads', {
                        method: 'POST',
                        body: formData
                    });
*/
                    const data = await res.json();

                    if(data.errorReporte == true){
                        uploaderInstance.showAlert('error', 100000, "El archivo del reporte de desayuno esta mal nombrado o es de un formato que no corresponde");
                    }

                    if(data.errorTurnos == true){
                        uploaderInstance.showAlert('error', 100000, "El archivo del listado de turnos esta mal nombrado o es de un formato que no corresponde");
                    }
                    
                    if(data.errorPax.length){
                        uploaderInstance.showAlert('warning', 100000, "Hay una diferencia en la cantidad de pasajeros entre la cantidad de pasajeros y los DNI ingresados en las habitaciones: " + data.errorPax.join(", "));
                    }

                    if(data.errorReporte == false && data.errorTurnos == false && !data.errorPax.length){
                        uploaderInstance.showAlert('success', 3000, "¡Reporte generado con exito y sin errores!");
                    }
                
                    
                    if (!res.ok) throw new Error("Error en la respuesta");
                    
                    // Reset form after success
                    setTimeout(() => {
                        this.resetForm();
                    }, 5000);


                } catch (error) {
                    console.error('Error uploading files:', error);
                    alert('Error al enviar los archivos. Por favor, intenta nuevamente.');
                } finally {
                    // Reset button state
                    btnText.style.display = 'inline';
                    loading.style.display = 'none';
                }
            }

            async downloadFiles() {
                try {
                    // Replace with your actual API URL
                    
                    const response = await fetch('https://turnosdesayuno.onrender.com/downloadReporte', {
                        method: 'GET'
                    });
                    
/*
                    const response = await fetch('http://127.0.0.1:3000/downloadReporte', {
                        method: 'GET'
                    });
*/
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

                    if (!response.ok) throw new Error("Error en la respuesta");

                    // Simulate API delay
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    // Reset form after success
                    setTimeout(() => {
                        this.resetForm();
                    }, 5000);

                } catch (error) {
                    console.error('Error download file:', error);
                    alert('Error al descargar el reporte. Por favor, intenta nuevamente.');
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

function dateToday(){
    const fecha = new Date();

    console.log(fecha);


    // Formatear en YYYY-MM-DD
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, "0");
    const dd = String(fecha.getDate() + 1).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
}

function setDateInput(){
    const hoy = dateToday()
    const dateInput = document.getElementById('report-date');
    dateInput.setAttribute('value', hoy)
}

async function wakeUpServer(){
    try {
        // Replace with your actual API URL
        const res = await fetch('https://turnosdesayuno.onrender.com/wakeUp', {
            method: 'GET'
        });
        /*
        const res = await fetch('http://127.0.0.1:3000/wakeUp', {
            method: 'GET'
        });
        */
        const data = await res.json();
        if (data.conect){
            uploaderInstance.showAlert('success', 3000, '¡Servidor operativo!');
        }
    } catch (error) {
        console.error('Error server:', error);
        alert('Error al conectar con el servidor. Por favor, intenta nuevamente.');
    }
}

 /* exponiendo la instancia globalmente para acceso desde consola/otros scripts */
        let uploaderInstance;

// Initialize the uploader when the page loads
    document.addEventListener('DOMContentLoaded', () => {
        uploaderInstance = new FileUploader();
        wakeUpServer();
        setDateInput();
    });

