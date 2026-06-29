// ============================================
// THEME TOGGLE
// ============================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ============================================
// TYPING EFFECT
// ============================================
const typedText = document.getElementById('typedText');
const phrases = ['BS Computer Science Student', 'Software Developer', 'AI Enthusiast', 'Problem Solver'];
let phraseIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 100;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    if (!isDeleting) {
        typedText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(typeEffect, 2000);
            return;
        }
        setTimeout(typeEffect, typingSpeed);
    } else {
        typedText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(typeEffect, 500);
            return;
        }
        setTimeout(typeEffect, typingSpeed / 2);
    }
}

document.addEventListener('DOMContentLoaded', () => setTimeout(typeEffect, 1000));

// ============================================
// NAVIGATION
// ============================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ============================================
// SKILLS ANIMATION
// ============================================
const skillBars = document.querySelectorAll('.skill-progress');
let skillsAnimated = false;

function animateSkills() {
    if (skillsAnimated) return;
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = '0%';
        setTimeout(() => { bar.style.width = width + '%'; }, 200);
    });
    skillsAnimated = true;
}

const skillsSection = document.querySelector('.skills');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) animateSkills();
    });
}, { threshold: 0.3 });
if (skillsSection) observer.observe(skillsSection);

// ============================================
// CONTACT FORM WITH FIRESTORE 🚀
// ============================================
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate Name
        const name = document.getElementById('name');
        const nameError = document.getElementById('nameError');
        if (name.value.trim().length < 2) {
            nameError.textContent = 'Please enter your full name';
            nameError.classList.add('show');
            isValid = false;
        } else {
            nameError.classList.remove('show');
        }
        
        // Validate Email
        const email = document.getElementById('email');
        const emailError = document.getElementById('emailError');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value.trim())) {
            emailError.textContent = 'Please enter a valid email address';
            emailError.classList.add('show');
            isValid = false;
        } else {
            emailError.classList.remove('show');
        }
        
        // Validate Subject
        const subject = document.getElementById('subject');
        const subjectError = document.getElementById('subjectError');
        if (subject.value.trim().length < 3) {
            subjectError.textContent = 'Please enter a subject';
            subjectError.classList.add('show');
            isValid = false;
        } else {
            subjectError.classList.remove('show');
        }
        
        // Validate Message
        const message = document.getElementById('message');
        const messageError = document.getElementById('messageError');
        if (message.value.trim().length < 10) {
            messageError.textContent = 'Please enter a message (at least 10 characters)';
            messageError.classList.add('show');
            isValid = false;
        } else {
            messageError.classList.remove('show');
        }
        
        // If form is valid, send to Firestore
        if (isValid) {
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            try {
                // Check if Firebase is available
                if (typeof window.db === 'undefined') {
                    throw new Error('Firebase not initialized. Please check your connection.');
                }
                
                // Import Firestore functions (if not already imported)
                const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
                
                // Save to Firestore
                const docRef = await addDoc(collection(window.db, 'messages'), {
                    name: name.value.trim(),
                    email: email.value.trim(),
                    subject: subject.value.trim(),
                    message: message.value.trim(),
                    timestamp: new Date().toISOString()
                });
                
                console.log('✅ Message saved with ID:', docRef.id);
                
                // Show success message
                contactForm.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
            } catch (error) {
                console.error('❌ Error saving message:', error);
                alert('❌ Failed to send message. Please try again later.\n\nError: ' + error.message);
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            }
        }
    });
}

// ============================================
// SMOOTH SCROLL - FIXED
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============================================
// PARALLAX EFFECT
// ============================================
const imageFrame = document.querySelector('.image-frame');
if (imageFrame) {
    window.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
            const x = (e.clientX / window.innerWidth - 0.5) * 10;
            const y = (e.clientY / window.innerHeight - 0.5) * 10;
            imageFrame.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
        }
    });
    document.addEventListener('mouseleave', () => {
        imageFrame.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
}

// ============================================
// SECTION ANIMATIONS
// ============================================
const animateOnScroll = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
};

document.querySelectorAll('.section-header, .timeline-item, .project-card, .skill-card, .about-text').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    const observer = new IntersectionObserver(animateOnScroll, { 
        threshold: 0.1, 
        rootMargin: '0px 0px -50px 0px' 
    });
    observer.observe(el);
});

// ============================================
// CONSOLE WELCOME
// ============================================
console.log('%c👋 Welcome to Donato\'s Portfolio!', 'font-size: 20px; font-weight: bold; color: #6c5ce7;');
console.log('%c📧 dj@gmail.com', 'font-size: 14px; color: #888;');
console.log('%c🐙 github.com/djureta23109563-spec', 'font-size: 14px; color: #888;');