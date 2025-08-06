// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Lógica para el botón de navegación (siempre presente)
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('nav ul');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });
    }

    // --- Lógica específica para index.html ---
    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel) {
        // Aquí va todo el código JS de tu carrusel principal
        // Asegúrate de que las variables como carouselTrack, slides, prevBtn, nextBtn, indicators
        // se seleccionen dentro de este bloque, en relación a heroCarousel.
        // Ejemplo:
        let currentSlide = 0;
        const carouselTrack = heroCarousel.querySelector('.carousel-track');
        const slides = heroCarousel.querySelectorAll('.carousel-slide');
        const prevButton = heroCarousel.querySelector('.carousel-prev');
        const nextButton = heroCarousel.querySelector('.carousel-next');
        const indicatorsContainer = heroCarousel.querySelector('.carousel-indicators');

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                    slide.classList.add('active');
                }
            });
            updateIndicators(index);
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        function createIndicators() {
            slides.forEach((_, index) => {
                const indicator = document.createElement('button');
                indicator.classList.add('carousel-indicator');
                if (index === 0) indicator.classList.add('active');
                indicator.setAttribute('role', 'tab');
                indicator.setAttribute('aria-selected', index === 0);
                indicator.setAttribute('aria-controls', `slide-${index}`);
                indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
                indicator.addEventListener('click', () => {
                    currentSlide = index;
                    showSlide(currentSlide);
                });
                indicatorsContainer.appendChild(indicator);
            });
        }

        function updateIndicators(index) {
            indicatorsContainer.querySelectorAll('.carousel-indicator').forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
                indicator.setAttribute('aria-selected', i === index);
            });
        }

        if (prevButton) prevButton.addEventListener('click', prevSlide);
        if (nextButton) nextButton.addEventListener('click', nextSlide);

        createIndicators();
        showSlide(currentSlide); // Muestra la primera diapositiva al cargar
        setInterval(nextSlide, 5000); // Auto-avance cada 5 segundos

        // Lógica para el contador de estadísticas
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            const counters = document.querySelectorAll('.count');
            const speed = 200; // Cuanto más bajo, más rápido

            const animateCount = (counter) => {
                const target = +counter.dataset.target;
                let current = 0;
                const increment = target / speed;

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                updateCounter();
            };

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        counters.forEach(animateCount);
                        observer.disconnect(); // Deja de observar una vez que se han animado
                    }
                });
            }, { threshold: 0.5 }); // Inicia la animación cuando el 50% de la sección es visible

            observer.observe(statsSection);
        }
    }


    // --- Lógica específica para propuesta.html ---
    const propuestaSection = document.getElementById('propuesta');
    if (propuestaSection) {
        // Lógica para abrir/cerrar modales y manejar pestañas
        const readMoreButtons = document.querySelectorAll('.card .read-more');
        const closeButtons = document.querySelectorAll('.modal .close-button');
        const tabButtons = document.querySelectorAll('.modal .tab-button');

        readMoreButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const targetModalId = event.target.dataset.target;
                const modal = document.getElementById(targetModalId);
                if (modal) {
                    modal.style.display = 'block';
                    document.body.classList.add('modal-open');
                    modal.setAttribute('aria-hidden', 'false');
                    event.target.setAttribute('aria-expanded', 'true');
                    modal.focus(); // Enfocar el modal al abrir
                }
            });
        });

        closeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const modal = event.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    document.body.classList.remove('modal-open');
                    modal.setAttribute('aria-hidden', 'true');
                    document.querySelector(`[data-target="${modal.id}"]`).setAttribute('aria-expanded', 'false');
                }
            });
        });

        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
                document.body.classList.remove('modal-open');
                event.target.setAttribute('aria-hidden', 'true');
                document.querySelector(`[data-target="${event.target.id}"]`).setAttribute('aria-expanded', 'false');
            }
        });

        // Manejo de pestañas dentro de los modales
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modalContent = button.closest('.modal-content');
                const tabId = button.dataset.tab;

                modalContent.querySelectorAll('.tab-button').forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                modalContent.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });

                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
                document.getElementById(tabId + '-content').classList.add('active');
            });
        });

         // Cierre con la tecla ESC
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                const openModal = document.querySelector('.modal[aria-hidden="false"]');
                if (openModal) {
                    openModal.style.display = 'none';
                    document.body.classList.remove('modal-open');
                    openModal.setAttribute('aria-hidden', 'true');
                    const targetButton = document.querySelector(`[data-target="${openModal.id}"]`);
                    if (targetButton) {
                        targetButton.setAttribute('aria-expanded', 'false');
                        targetButton.focus(); // Vuelve el foco al botón que abrió el modal
                    }
                }
                const openLightbox = document.getElementById('gallery-lightbox');
                if (openLightbox && openLightbox.style.display === 'block') {
                    openLightbox.style.display = 'none';
                    document.body.classList.remove('modal-open');
                    // Aquí podrías querer devolver el foco al elemento que abrió el lightbox
                }
            }
        });
    }

    // --- Lógica específica para galeria.html ---
    const galleryCarouselContainer = document.querySelector('.carousel-container-gallery');
    if (galleryCarouselContainer) {
        // Aquí va todo el código JS de tu carrusel de galería y el lightbox
        const galleryCarouselSlide = galleryCarouselContainer.querySelector('.carousel-slide-gallery');
        const galleryImages = galleryCarouselContainer.querySelectorAll('.carousel-slide-gallery img');
        const galleryPrevBtn = galleryCarouselContainer.querySelector('.prev-btn-gallery');
        const galleryNextBtn = galleryCarouselContainer.querySelector('.next-btn-gallery');
        const galleryDotsContainer = galleryCarouselContainer.querySelector('.carousel-dots-gallery');

        const lightbox = document.getElementById('gallery-lightbox');
        const lightboxImage = lightbox.querySelector('.lightbox-current-image');
        const lightboxThumbnailsContainer = lightbox.querySelector('.lightbox-thumbnails');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        const lightboxClose = lightbox.querySelector('.lightbox-close');

        let currentImageIndex = 0;
        const imagesPerPage = 3; // Puedes ajustar cuántas imágenes se muestran en la vista previa del carrusel

        function updateGalleryCarousel() {
            const offset = -currentImageIndex * (100 / imagesPerPage);
            galleryCarouselSlide.style.transform = `translateX(${offset}%)`;
            updateGalleryDots();
        }

        function nextGallerySlide() {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            if (currentImageIndex > galleryImages.length - imagesPerPage) {
                currentImageIndex = 0; // Vuelve al inicio si no hay suficientes imágenes para la siguiente página
            }
            updateGalleryCarousel();
        }

        function prevGallerySlide() {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            if (currentImageIndex < 0) { // Manejo para ir al final si se retrocede desde el inicio
                currentImageIndex = galleryImages.length - imagesPerPage;
                if (currentImageIndex < 0) currentImageIndex = 0; // Asegura que no sea negativo si hay pocas imágenes
            }
            updateGalleryCarousel();
        }

        function createGalleryDots() {
            galleryImages.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('gallery-dot');
                if (index === 0) dot.classList.add('active');
                dot.setAttribute('role', 'tab');
                dot.setAttribute('aria-selected', index === 0);
                dot.setAttribute('aria-controls', `gallery-image-${index}`);
                dot.setAttribute('aria-label', `View gallery image ${index + 1}`);
                dot.addEventListener('click', () => {
                    currentImageIndex = index;
                    updateGalleryCarousel();
                });
                galleryDotsContainer.appendChild(dot);
            });
        }

        function updateGalleryDots() {
            galleryDotsContainer.querySelectorAll('.gallery-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentImageIndex);
                dot.setAttribute('aria-selected', i === currentImageIndex);
            });
        }

        if (galleryPrevBtn) galleryPrevBtn.addEventListener('click', prevGallerySlide);
        if (galleryNextBtn) galleryNextBtn.addEventListener('click', nextGallerySlide);

        createGalleryDots();
        updateGalleryCarousel();

        // Lightbox functionality
        function openLightbox(index) {
            currentImageIndex = index;
            lightbox.style.display = 'block';
            document.body.classList.add('modal-open');
            updateLightboxImage();
            createLightboxThumbnails();
            lightbox.setAttribute('aria-hidden', 'false');
            lightbox.focus(); // Enfocar el lightbox al abrir
        }

        function updateLightboxImage() {
            lightboxImage.src = galleryImages[currentImageIndex].src;
            lightboxImage.alt = galleryImages[currentImageIndex].alt;
            updateLightboxThumbnails();
        }

        function nextLightboxImage() {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            updateLightboxImage();
        }

        function prevLightboxImage() {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightboxImage();
        }

        function createLightboxThumbnails() {
            lightboxThumbnailsContainer.innerHTML = ''; // Limpiar miniaturas existentes
            galleryImages.forEach((img, index) => {
                const thumb = document.createElement('img');
                thumb.src = img.src;
                thumb.alt = img.alt;
                thumb.classList.add('lightbox-thumbnail');
                if (index === currentImageIndex) thumb.classList.add('active');
                thumb.addEventListener('click', () => {
                    currentImageIndex = index;
                    updateLightboxImage();
                });
                lightboxThumbnailsContainer.appendChild(thumb);
            });
        }

        function updateLightboxThumbnails() {
            lightboxThumbnailsContainer.querySelectorAll('.lightbox-thumbnail').forEach((thumb, i) => {
                thumb.classList.toggle('active', i === currentImageIndex);
            });
        }

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightboxImage);
        if (lightboxNext) lightboxNext.addEventListener('click', nextLightboxImage);
        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                lightbox.style.display = 'none';
                document.body.classList.remove('modal-open');
                lightbox.setAttribute('aria-hidden', 'true');
            });
        }
    }

    // --- Lógica específica para noticias.html ---
    const newsContainer = document.getElementById('news-container');
    if (newsContainer) {
        const loadMoreButton = document.getElementById('load-more-news');
        let newsItems = []; // Aquí podrías cargar tus noticias desde un JSON o un array
        let currentPage = 0;
        const itemsPerPage = 3;

        // Ejemplo de datos de noticias (puedes reemplazarlos por una carga real)
        newsItems = [
            { title: 'Concurso Intercolegial de Robótica 2025', date: '25 de Junio de 2025', content: 'Nuestros alumnos de Electrónica e Informática brillaron en el concurso anual de robótica, obteniendo el primer puesto en la categoría de innovación.' },
            { title: 'Inscripciones Abiertas para el Ciclo Lectivo 2026', date: '15 de Junio de 2025', content: 'Información sobre el proceso de inscripción para el próximo ciclo lectivo. ¡Te esperamos!' },
            { title: 'Visita Técnica a Fábrica de Software', date: '10 de Junio de 2025', content: 'Los estudiantes de Informática realizaron una enriquecedora visita a una importante empresa de desarrollo de software, conociendo de cerca el ambiente laboral.' },
            { title: 'Jornada de Puertas Abiertas', date: '01 de Junio de 2025', content: 'Invitamos a toda la comunidad a conocer nuestras instalaciones y la propuesta educativa para el año 2026.' },
            { title: 'Alumnos de M.M.O. Finalizan Proyecto de Vivienda Ecológica', date: '28 de Mayo de 2025', content: 'Nuestros futuros Maestros Mayores de Obra presentaron su innovador prototipo de vivienda sostenible, aplicando conocimientos de energías renovables.' },
            { title: 'Semana de la Ciencia y la Tecnología', date: '20 de Mayo de 2025', content: 'Actividades, talleres y exposiciones para fomentar el interés por la ciencia y la tecnología entre los jóvenes.' }
        ];

        function displayNews(page) {
            const start = page * itemsPerPage;
            const end = start + itemsPerPage;
            const newsToDisplay = newsItems.slice(start, end);

            newsToDisplay.forEach(news => {
                const newsArticle = document.createElement('article');
                newsArticle.classList.add('news-item');
                newsArticle.innerHTML = `
                    <h3>${news.title}</h3>
                    <p class="news-date"><i class="far fa-calendar-alt"></i> ${news.date}</p>
                    <p>${news.content}</p>
                    <a href="#" class="read-more-news">Leer más</a>
                `;
                newsContainer.appendChild(newsArticle);
            });

            // Ocultar botón "Cargar Más" si ya no hay más noticias
            if (end >= newsItems.length) {
                loadMoreButton.style.display = 'none';
            } else {
                loadMoreButton.style.display = 'block';
            }
        }

        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', () => {
                currentPage++;
                displayNews(currentPage);
            });
        }

        // Carga inicial de noticias
        displayNews(currentPage);
    }

    // --- Lógica específica para contact.html ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const formStatus = document.getElementById('form-status');

        emailInput.addEventListener('input', () => {
            if (emailInput.validity.valid) {
                emailError.textContent = '';
                emailError.setAttribute('aria-hidden', 'true');
            } else {
                showEmailError();
            }
        });

        function showEmailError() {
            if (emailInput.validity.valueMissing) {
                emailError.textContent = 'El correo electrónico es un campo obligatorio.';
            } else if (emailInput.validity.typeMismatch) {
                emailError.textContent = 'Por favor, introduce una dirección de correo electrónico válida.';
            } else {
                emailError.textContent = '';
            }
            emailError.setAttribute('aria-hidden', 'false');
        }

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Evita el envío por defecto del formulario

            if (!emailInput.validity.valid) {
                showEmailError();
                return; // Detiene el envío si el email no es válido
            }

            // Aquí iría la lógica para enviar el formulario, por ejemplo, con Fetch API
            formStatus.textContent = 'Enviando mensaje...';
            formStatus.classList.remove('success', 'error');
            formStatus.classList.add('loading');
            formStatus.setAttribute('aria-live', 'assertive');

            setTimeout(() => { // Simula un envío asíncrono
                const isSuccess = Math.random() > 0.3; // 70% de éxito, 30% de error

                if (isSuccess) {
                    formStatus.textContent = '¡Mensaje enviado con éxito! Te responderemos a la brevedad.';
                    formStatus.classList.remove('loading', 'error');
                    formStatus.classList.add('success');
                    contactForm.reset(); // Limpia el formulario
                } else {
                    formStatus.textContent = 'Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.';
                    formStatus.classList.remove('loading', 'success');
                    formStatus.classList.add('error');
                }
            }, 2000); // Espera 2 segundos para simular el envío
        });
    }
});