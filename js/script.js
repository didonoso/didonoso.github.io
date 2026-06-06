document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const header = document.querySelector('header');
    
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Initial check
    handleScroll();
    
    // Listen to scroll events
    window.addEventListener('scroll', handleScroll);

    // ============================================
    // HAMBURGER MENU FUNCTIONALITY
    // ============================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Toggle menu on hamburger click
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update aria-expanded for accessibility
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });
    }
    
    // Close menu when clicking on a navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    // ============================================
    // AUTOMATIC HERO CAROUSEL
    // ============================================
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    
    // Function to change slide
    function nextSlide() {
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        
        // Increment the index
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Add active class to new slide
        slides[currentSlide].classList.add('active');
    }
    
    // Change image every 5 seconds (5000 milliseconds)
    // You can adjust this value as needed
    setInterval(nextSlide, 5000);

    // ============================================
    // EMAILJS CONTACT FORM
    // ============================================
    
    // Initialize EmailJS with your Public Key
    // IMPORTANTE: Reemplaza 'YOUR_PUBLIC_KEY' con tu Public Key de EmailJS
    emailjs.init('ussj4jP1_VaMK3jlp'); // Obtén esto de tu cuenta EmailJS
    
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            submitBtn.classList.add('loading');
            formStatus.style.display = 'none';
            
            // Send email using EmailJS
            // IMPORTANTE: Reemplaza 'YOUR_SERVICE_ID' y 'YOUR_TEMPLATE_ID' 
            // con tus IDs de EmailJS
            emailjs.sendForm(
                'service_mnflo3a',      // Service ID de EmailJS
                'template_qmahf75',     // Template ID de EmailJS
                this
            )
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Show success message
                formStatus.textContent = '✓ Message sent successfully!';
                formStatus.className = 'form-status success';
                formStatus.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';
                submitBtn.classList.remove('loading');
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
                
            }, function(error) {
                console.log('FAILED...', error);
                
                // Show error message
                formStatus.textContent = '✗ Oops! Something went wrong. Please try again or email me directly.';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
                
                // Reset button
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';
                submitBtn.classList.remove('loading');
            });
        });
    }
});