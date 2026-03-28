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

    // 4. WhatsApp Widget Logic
    const whatsappWidget = document.getElementById('whatsapp-widget');
    const whatsappPopup = document.getElementById('whatsapp-popup');

    whatsappWidget.addEventListener('click', (e) => {
        // Toggle popup only if clicking the widget container, not the link inside
        if (e.target.closest('#whatsapp-widget') && !e.target.closest('a')) {
            const isVisible = whatsappPopup.style.display === 'block';
            whatsappPopup.style.display = isVisible ? 'none' : 'block';
        }
    });

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
        if (!whatsappWidget.contains(e.target)) {
            whatsappPopup.style.display = 'none';
        }
    });

    // 4.1 WhatsApp Click Tracking to n8n
    const whatsappChatBtn = whatsappPopup.querySelector('a.btn-primary');
    whatsappChatBtn.addEventListener('click', async () => {
        const clickData = {
            event: 'whatsapp_click',
            origin: window.location.pathname,
            fecha: new Date().toISOString()
        };
        
        try {
            // Send to n8n in background
            fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clickData)
            });
        } catch (e) {
            console.error('Error logging WhatsApp click:', e);
        }
    });

    // 4. n8n Form Submission Link
    const contactForm = document.getElementById('n8n-contact-form');
    const formFeedback = document.getElementById('form-feedback');

    // CONFIGURATION: Replace with your actual n8n webhook URL
    const N8N_WEBHOOK_URL = 'https://n8n-production-a0599.up.railway.app/webhook/webhook-kura';

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            nombre: contactForm.querySelector('input[type="text"]').value,
            email: contactForm.querySelector('input[type="email"]').value,
            servicio: contactForm.querySelector('select').value,
            mensaje: contactForm.querySelector('textarea').value,
            fecha: new Date().toISOString()
        };

        // UI feedback before actual fetch
        const submitBtn = contactForm.querySelector('button');
        const originalText = submitBtn.innerText;
        submitBtn.disabled = true;
        submitBtn.innerText = 'Enviando...';

        try {
            // Simulated fetch if URL is default, real fetch otherwise
            if (N8N_WEBHOOK_URL.includes('your-n8n-instance')) {
                console.log('n8n Simulation (Success):', formData);
                await new Promise(resolve => setTimeout(resolve, 1500));
            } else {
                const response = await fetch(N8N_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                if (!response.ok) throw new Error('Network response was not ok');
            }

            // Success feedback
            formFeedback.style.display = 'block';
            contactForm.reset();
            setTimeout(() => {
                formFeedback.style.display = 'none';
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            }, 5000);

        } catch (error) {
            console.error('Error sending lead to n8n:', error);
            alert('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.');
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
        }
    });
});
