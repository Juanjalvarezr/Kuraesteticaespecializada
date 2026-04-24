// main.js - Interaction and Logic for Kura Estética

document.addEventListener('DOMContentLoaded', () => {

    // 1. Header background on scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Reveal animations on scroll
    const reveals = document.querySelectorAll('.reveal');
    const options = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    // Add necessary CSS for intersection observer dynamically if not in style.css
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease-out;
        }
        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(styleSheet);

    // 3. Carousel Logic
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const slides = document.querySelectorAll('.carousel-slide');
    
    let currentIndex = 0;
    const slideCount = slides.length;
    const slidesVisible = window.innerWidth > 768 ? 2 : 1;

    const updateCarousel = () => {
        const slideWidth = slides[0].offsetWidth + 20; // 20 is gap
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    };

    nextBtn.addEventListener('click', () => {
        if (currentIndex < slideCount - slidesVisible) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop back
        }
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = slideCount - slidesVisible;
        }
        updateCarousel();
    });

    // Auto play carousel
    let autoPlay = setInterval(() => {
        nextBtn.click();
    }, 5000);

    // Stop auto play on interaction
    [prevBtn, nextBtn].forEach(btn => {
        btn.addEventListener('mouseenter', () => clearInterval(autoPlay));
        btn.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => {
                nextBtn.click();
            }, 5000);
        });
    });

    // Handle resize
    window.addEventListener('resize', () => {
        updateCarousel();
    });

    // 4. WhatsApp Widget Logic (Desktop Only)
    const whatsappWidget = document.getElementById('whatsapp-widget');
    const whatsappPopup = document.getElementById('whatsapp-popup');

    if (whatsappWidget && whatsappPopup) {
        whatsappWidget.addEventListener('click', (e) => {
            if (!e.target.closest('a')) {
                const isVisible = whatsappPopup.style.display === 'block';
                whatsappPopup.style.display = isVisible ? 'none' : 'block';
            }
        });
    }

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
        if (!whatsappWidget.contains(e.target)) {
            whatsappPopup.style.display = 'none';
        }
    });

    // CONFIGURATION: EmailJS - Servicio gratuito para enviar emails directamente
    // Regístrate en https://www.emailjs.com/ y reemplaza estos valores
    const EMAILJS_SERVICE_ID = 'service_kura'; // Tu Service ID de EmailJS
    const EMAILJS_TEMPLATE_ID = 'template_contacto'; // Tu Template ID de EmailJS
    const EMAILJS_PUBLIC_KEY = 'f9l8Zypv5zIgRhODa'; // Tu Public Key de EmailJS

    // Inicializar EmailJS (cargar el script si no está cargado)
    if (!window.emailjs) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = () => {
            window.emailjs.init(EMAILJS_PUBLIC_KEY);
        };
        document.head.appendChild(script);
    } else {
        window.emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    // 4.1 WhatsApp Click Tracking (solo logging local)
    const whatsappChatBtn = whatsappPopup?.querySelector('a.btn-primary');
    if (whatsappChatBtn) {
        whatsappChatBtn.addEventListener('click', () => {
            console.log('WhatsApp click tracked:', {
                origin: window.location.pathname,
                fecha: new Date().toISOString()
            });
        });
    }

    // 4. n8n Form Submission Link
    const contactForm = document.getElementById('n8n-contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form values
            const nameInput = contactForm.querySelector('input[type="text"]');
            const emailInput = contactForm.querySelector('input[type="email"]');
            const servicioSelect = contactForm.querySelector('select');
            const mensajeTextarea = contactForm.querySelector('textarea');
            
            // Basic validation
            if (!nameInput.value.trim() || !emailInput.value.trim() || !servicioSelect.value) {
                alert('Por favor completa todos los campos obligatorios.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                alert('Por favor ingresa un email válido.');
                return;
            }
            
            const formData = {
                nombre: nameInput.value.trim(),
                email: emailInput.value.trim(),
                servicio: servicioSelect.value,
                mensaje: mensajeTextarea.value.trim(),
                fecha: new Date().toISOString(),
                pagina: window.location.pathname,
                to_email: 'info@kuraestetica.com' // Email donde recibirás las notificaciones
            };

            // UI feedback before sending
            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = 'Enviando...';

            try {
                console.log('Enviando formulario por EmailJS:', formData);
                
                // Verificar que EmailJS esté cargado
                if (!window.emailjs) {
                    throw new Error('EmailJS no está cargado. Por favor recarga la página.');
                }
                
                // Enviar email usando EmailJS
                const response = await window.emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    formData
                );
                
                if (response.status !== 200) {
                    throw new Error(`EmailJS error: ${response.text}`);
                }

                // Success feedback
                formFeedback.style.display = 'block';
                contactForm.reset();
                
                // Reset button after delay
                setTimeout(() => {
                    formFeedback.style.display = 'none';
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalText;
                }, 5000);

                console.log('Formulario enviado exitosamente por EmailJS');

            } catch (error) {
                console.error('Error sending email:', error);
                alert('Hubo un error al enviar el mensaje. Por favor intenta de nuevo o contáctanos directamente por WhatsApp.');
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            }
        });
    } else {
        console.log('Formulario o elemento de feedback no encontrado');
    }
});
