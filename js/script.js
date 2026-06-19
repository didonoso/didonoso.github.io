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
            // Use localized 'sending' text when available
            try { btnText.textContent = i18n.t('contact.form.sending'); } catch (e) { btnText.textContent = 'Sending...'; }
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
                formStatus.textContent = i18n.t('contact.form.success');
                formStatus.className = 'form-status success';
                formStatus.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.disabled = false;
                btnText.textContent = i18n.t('contact.form.send');
                submitBtn.classList.remove('loading');
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
                
            }, function(error) {
                console.log('FAILED...', error);
                
                // Show error message
                formStatus.textContent = i18n.t('contact.form.error');
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
                
                // Reset button
                submitBtn.disabled = false;
                btnText.textContent = i18n.t('contact.form.send');
                submitBtn.classList.remove('loading');
            });
        });
    }

    // ============================================
    // SIMPLE I18N (NAV ONLY)
    // ============================================
    const i18n = {
        current: 'en',
        cache: {},
        async load(lang) {
            if (this.cache[lang]) return this.cache[lang];
            try {
                const res = await fetch(`/locales/${lang}.json`);
                if (!res.ok) throw new Error('Locale not found');
                const json = await res.json();
                this.cache[lang] = json;
                return json;
            } catch (e) {
                console.warn('Failed to load locale', lang, e);
                // Ensure we set an empty cache entry so t() won't throw and will return keys
                this.cache[lang] = {};
                return this.cache[lang];
            }
        },
        t(key) {
            const parts = key.split('.');
            let node = this.cache[this.current];
            for (const p of parts) {
                if (!node) return key;
                node = node[p];
            }
            return node ?? key;
        },
        async translatePage() {
            await this.load(this.current);
            // translate elements with data-i18n (textContent)
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const txt = this.t(key);
                if (txt !== undefined) el.textContent = txt;
            });
            // translate elements with data-i18n-html (innerHTML)
            document.querySelectorAll('[data-i18n-html]').forEach(el => {
                const key = el.getAttribute('data-i18n-html');
                const txt = this.t(key);
                if (txt !== undefined) el.innerHTML = txt;
            });
            // translate placeholders
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                const txt = this.t(key);
                if (txt !== undefined) el.setAttribute('placeholder', txt);
            });
            // set document language
            document.documentElement.lang = this.current;
            // update SEO meta tags
            this.updateMetaTags();
        },
        updateMetaTags() {
            const title = this.t('seo.title');
            const description = this.t('seo.description');
            const ogTitle = this.t('seo.og_title');
            const twitterTitle = this.t('seo.twitter_title');
            
            // Update page title
            if (title) document.title = title;
            
            // Update meta description
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc && description) metaDesc.setAttribute('content', description);
            
            // Update Open Graph tags
            const ogTitleMeta = document.querySelector('meta[property="og:title"]');
            if (ogTitleMeta && ogTitle) ogTitleMeta.setAttribute('content', ogTitle);
            
            const ogDescMeta = document.querySelector('meta[property="og:description"]');
            if (ogDescMeta && description) ogDescMeta.setAttribute('content', description);
            
            // Update Twitter Card tags
            const twitterTitleMeta = document.querySelector('meta[name="twitter:title"]');
            if (twitterTitleMeta && twitterTitle) twitterTitleMeta.setAttribute('content', twitterTitle);
            
            const twitterDescMeta = document.querySelector('meta[name="twitter:description"]');
            if (twitterDescMeta && description) twitterDescMeta.setAttribute('content', description);
            
            // Update locale meta tag
            const ogLocaleMeta = document.querySelector('meta[property="og:locale"]');
            if (ogLocaleMeta) {
                ogLocaleMeta.setAttribute('content', this.current === 'es' ? 'es_ES' : 'en_US');
            }
        },
        async setLanguage(lang) {
            this.current = lang;
            localStorage.setItem('site_lang', lang);
            await this.translatePage();
            updateToggleUI(lang);
        }
    };

    function updateToggleUI(lang) {
        const btn = document.getElementById('lang-toggle');
        if (!btn) return;
        btn.textContent = lang.toUpperCase();
        btn.setAttribute('aria-pressed', lang === 'en' ? 'false' : 'true');
    }

    function initI18n() {
        const saved = localStorage.getItem('site_lang');
        const browser = (navigator.language && navigator.language.startsWith('es')) ? 'es' : 'en';
        i18n.current = saved || browser;
        // Initialize UI
        updateToggleUI(i18n.current);
        // Load and translate
        i18n.translatePage();

        const btn = document.getElementById('lang-toggle');
        if (btn) {
            btn.addEventListener('click', async () => {
                const next = i18n.current === 'en' ? 'es' : 'en';
                await i18n.setLanguage(next);
            });
            // allow toggle with Enter/Space
            btn.addEventListener('keydown', async (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const next = i18n.current === 'en' ? 'es' : 'en';
                    await i18n.setLanguage(next);
                }
            });
        }
    }

    // Start i18n
    initI18n();
});