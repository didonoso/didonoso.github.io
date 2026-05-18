document.addEventListener('DOMContentLoaded', function() {

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
});