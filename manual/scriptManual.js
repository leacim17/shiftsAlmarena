// Funcionalidad de acordeones
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const isActive = this.classList.contains('active');
                
                // Cerrar todos los acordeones
                document.querySelectorAll('.accordion-header').forEach(h => {
                    h.classList.remove('active');
                    h.nextElementSibling.classList.remove('active');
                });
                
                // Abrir el acordeón clickeado si no estaba activo
                if (!isActive) {
                    this.classList.add('active');
                    content.classList.add('active');
                }
            });
        });