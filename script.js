// Navigation scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 10);
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const body = document.body;
const backdrop = document.querySelector('.backdrop');
const header = document.querySelector('header');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.classList.toggle('active');
        backdrop.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navLinks.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });
}

// Close mobile menu when clicking on links
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            backdrop.classList.remove('active');
            body.style.overflow = '';
            
            // Smooth scroll to the section with a slight delay
            const target = item.getAttribute('href');
            if (target && target.startsWith('#') && target.length > 1) {
                const targetElement = document.querySelector(target);
                if (targetElement) {
                    // Prevenir comportamiento predeterminado
                    event.preventDefault();
                    
                    // Small delay to allow menu to close
                    setTimeout(() => {
                        const headerHeight = header.offsetHeight;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                        window.scrollTo({
                            top: targetPosition - headerHeight,
                            behavior: 'smooth'
                        });
                    }, 300);
                }
            }
        }
    });
});

// Close mobile menu when clicking on backdrop
if (backdrop) {
    backdrop.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            backdrop.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

// Close mobile menu when pressing Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        backdrop.classList.remove('active');
        body.style.overflow = '';
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
    if (navLinks.classList.contains('active') && 
        !event.target.closest('.nav-links') && 
        !event.target.closest('.hamburger')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        backdrop.classList.remove('active');
        body.style.overflow = '';
    }
});

// Add active class to nav links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const headerHeight = header.offsetHeight;
        
        if (window.pageYOffset >= sectionTop - headerHeight - 20) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('current');
        const href = link.getAttribute('href');
        if (href && href.substring(1) === currentSection) {
            link.classList.add('current');
        }
    });
});

// Service tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        // Remove active class from all buttons and contents
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Testimonial slider functionality
let currentSlide = 0;
let testimonialInterval;
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');

// Function to show a specific slide
function showSlide(index) {
    // Hide all slides
    testimonialSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Remove active class from all dots
    testimonialDots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show the selected slide and activate corresponding dot
    testimonialSlides[index].classList.add('active');
    testimonialDots[index].classList.add('active');
    
    // Update current slide index
    currentSlide = index;
}

// Function to show the next slide
function nextSlide() {
    let nextIndex = currentSlide + 1;
    
    // Reset to first slide if at the end
    if (nextIndex >= testimonialSlides.length) {
        nextIndex = 0;
    }
    
    showSlide(nextIndex);
}

// Function to start automatic rotation
function startTestimonialRotation() {
    // Clear any existing interval
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
    }
    
    // Set a new interval
    testimonialInterval = setInterval(() => {
        nextSlide();
    }, 5000); // Change slide every 5 seconds
}

// Initialize testimonials
function initTestimonials() {
    if (testimonialSlides.length > 0 && testimonialDots.length > 0) {
        // Set up dot click handlers
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                
                // Reset timer when manually changing slides
                startTestimonialRotation();
            });
        });
        
        // Show the first slide
        showSlide(0);
        
        // Start automatic rotation
        startTestimonialRotation();
        
        // Pause rotation when user hovers over testimonial container
        const testimonialContainer = document.querySelector('.testimonial-container');
        if (testimonialContainer) {
            testimonialContainer.addEventListener('mouseenter', () => {
                clearInterval(testimonialInterval);
            });
            
            testimonialContainer.addEventListener('mouseleave', () => {
                startTestimonialRotation();
            });
        }
    }
}

// Client logos scrolling effect
function initClientLogos() {
    const logosTracks = document.querySelectorAll('.logos-track');
    
    if (logosTracks.length > 0) {
        logosTracks.forEach(track => {
            // Get original logos
            const logos = Array.from(track.children);
            const originalLogosCount = logos.length;
            
            // Function to ensure we have enough logos in the track
            const ensureEnoughLogos = () => {
                const containerWidth = track.parentElement.offsetWidth;
                const trackWidth = track.scrollWidth;
                
                // We want at least 3 screens worth of logos to ensure continuous scrolling
                const minimumWidth = containerWidth * 3;
                
                // If we don't have enough logos, add more clones
                if (trackWidth < minimumWidth) {
                    // Calculate how many sets we need to add
                    const setsNeeded = Math.ceil((minimumWidth - trackWidth) / (trackWidth / logos.length)) + 1;
                    
                    // Add the required sets of logos
                    for (let i = 0; i < setsNeeded; i++) {
                        logos.forEach(logo => {
                            const clone = logo.cloneNode(true);
                            track.appendChild(clone);
                        });
                    }
                }
            };
            
            // Create initial set of duplicates
            for (let i = 0; i < 3; i++) {
                logos.forEach(logo => {
                    const clone = logo.cloneNode(true);
                    track.appendChild(clone);
                });
            }
            
            // Set animation duration based on the number of original logos - much slower
            const duration = Math.max(30, originalLogosCount * 5);
            track.style.animationDuration = duration + 's';
            
            // Apply the appropriate animation
            if (track.parentElement.classList.contains('slider-right')) {
                track.style.animationName = 'scroll-right';
            } else if (track.parentElement.classList.contains('slider-left')) {
                track.style.animationName = 'scroll-left';
            }
            
            // Initial check to ensure enough logos
            ensureEnoughLogos();
            
            // Re-check when window resizes
            window.addEventListener('resize', () => {
                // Reset animation
                track.style.animationPlayState = 'paused';
                
                // Check if we need to add more logos
                ensureEnoughLogos();
                
                // Resume animation
                setTimeout(() => {
                    track.style.animationPlayState = 'running';
                }, 100);
            });
            
            // Add animationend listener to ensure infinite scrolling
            track.addEventListener('animationiteration', () => {
                ensureEnoughLogos();
            });
        });
    }
}

// Form validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        if (!name || !email || !phone || !subject || !message) {
            alert('Por favor, complete todos los campos requeridos.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingrese un correo electrónico válido.');
            return;
        }
        
        // If validation passes, would normally submit the form
        alert('¡Gracias por su mensaje! Nos pondremos en contacto con usted pronto.');
        contactForm.reset();
    });
}

// Animate on scroll (updated implementation)
const animateElements = document.querySelectorAll('.feature, .service-card, .iris-feature, .client-type, .testimonials-wrapper, .client-showcase');

function checkScroll() {
    const triggerBottom = window.innerHeight * 0.8;
    
    animateElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < triggerBottom) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Set initial state for animation
animateElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Check elements on scroll
window.addEventListener('scroll', checkScroll);

// Highlight active section in navbar
function highlightNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100; // Offset for better accuracy
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Smooth scroll to anchors
function initSmoothScroll() {
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu when clicking a link
            if (window.innerWidth <= 768) {
                document.querySelector('.nav-links').classList.remove('active');
                document.querySelector('.hamburger').classList.remove('active');
                document.querySelector('.backdrop').classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Adjust for header height
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// About Carousel functionality
let aboutCurrentSlide = 0;
let aboutCarouselInterval;
const aboutSlides = document.querySelectorAll('.carousel-slide');
const aboutIndicators = document.querySelectorAll('.indicator');
const prevBtn = document.querySelector('.carousel-control.prev');
const nextBtn = document.querySelector('.carousel-control.next');

// Function to show a specific slide in about carousel
function showAboutSlide(index) {
    // Hide all slides
    aboutSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Remove active class from all indicators
    aboutIndicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Show the selected slide and activate corresponding indicator
    aboutSlides[index].classList.add('active');
    aboutIndicators[index].classList.add('active');
    
    // Update current slide index
    aboutCurrentSlide = index;
}

// Function to show the next slide in about carousel
function nextAboutSlide() {
    let nextIndex = aboutCurrentSlide + 1;
    
    // Reset to first slide if at the end
    if (nextIndex >= aboutSlides.length) {
        nextIndex = 0;
    }
    
    showAboutSlide(nextIndex);
}

// Function to show the previous slide in about carousel
function prevAboutSlide() {
    let prevIndex = aboutCurrentSlide - 1;
    
    // Reset to last slide if at the beginning
    if (prevIndex < 0) {
        prevIndex = aboutSlides.length - 1;
    }
    
    showAboutSlide(prevIndex);
}

// Function to start automatic rotation of about carousel
function startAboutCarouselRotation() {
    // Clear any existing interval
    if (aboutCarouselInterval) {
        clearInterval(aboutCarouselInterval);
    }
    
    // Set a new interval
    aboutCarouselInterval = setInterval(() => {
        nextAboutSlide();
    }, 4000); // Change slide every 4 seconds
}

// Initialize about carousel
function initAboutCarousel() {
    if (aboutSlides.length > 0 && aboutIndicators.length > 0) {
        // Set up indicator click handlers
        aboutIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showAboutSlide(index);
                
                // Reset timer when manually changing slides
                startAboutCarouselRotation();
            });
        });
        
        // Set up prev button click handler
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevAboutSlide();
                
                // Reset timer when manually changing slides
                startAboutCarouselRotation();
            });
        }
        
        // Set up next button click handler
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextAboutSlide();
                
                // Reset timer when manually changing slides
                startAboutCarouselRotation();
            });
        }
        
        // Show the first slide
        showAboutSlide(0);
        
        // Start automatic rotation
        startAboutCarouselRotation();
        
        // Pause rotation when user hovers over carousel container
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(aboutCarouselInterval);
            });
            
            carouselContainer.addEventListener('mouseleave', () => {
                startAboutCarouselRotation();
            });
        }
    }
}

// Hero Carousel automatic rotation
let heroCurrentSlide = 0;
let heroCarouselInterval;
const heroSlides = document.querySelectorAll('.hero-slide');

// Function to apply background images based on screen size
function applyResponsiveBackgrounds() {
    const isMobile = window.innerWidth <= 768;
    
    heroSlides.forEach(slide => {
        const mobileBg = slide.getAttribute('data-mobile-bg');
        const desktopBg = slide.getAttribute('data-desktop-bg');
        
        if (isMobile && mobileBg) {
            slide.style.backgroundImage = `url('${mobileBg}')`;
        } else if (desktopBg) {
            slide.style.backgroundImage = `url('${desktopBg}')`;
        }
    });
}

// Function to show a specific hero slide
function showHeroSlide(index) {
    // Hide all slides
    heroSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show the selected slide
    heroSlides[index].classList.add('active');
    
    // Update current slide index
    heroCurrentSlide = index;
}

// Function to show the next hero slide
function nextHeroSlide() {
    let nextIndex = heroCurrentSlide + 1;
    
    // Reset to first slide if at the end
    if (nextIndex >= heroSlides.length) {
        nextIndex = 0;
    }
    
    showHeroSlide(nextIndex);
}

// Function to start automatic rotation of hero carousel
function startHeroCarouselRotation() {
    // Clear any existing interval
    if (heroCarouselInterval) {
        clearInterval(heroCarouselInterval);
    }
    
    // Set a new interval - rotate every 5 seconds
    heroCarouselInterval = setInterval(() => {
        nextHeroSlide();
    }, 5000);
}

// Initialize hero carousel
function initHeroCarousel() {
    if (heroSlides.length > 0) {
        // Apply correct background images based on screen size
        applyResponsiveBackgrounds();
        
        // Add window resize listener to update backgrounds when screen size changes
        window.addEventListener('resize', applyResponsiveBackgrounds);
        
        // Show the first slide
        showHeroSlide(0);
        
        // Start automatic rotation
        startHeroCarouselRotation();
    }
}

// Initialize all components when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing functionality
    // Initial animations check
    if (typeof checkScroll === 'function') {
        checkScroll();
    }
    
    // Initialize testimonials
    if (typeof initTestimonials === 'function') {
        initTestimonials();
    }
    
    // Initialize client logos
    if (typeof initClientLogos === 'function') {
        initClientLogos();
    }
    
    if (typeof initSmoothScroll === 'function') {
        initSmoothScroll();
    }
    
    // Initialize about carousel
    initAboutCarousel();
    
    // Initialize hero carousel
    initHeroCarousel();
    
    highlightNavOnScroll();
}); 