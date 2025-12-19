/* =====================================================
   EJERCICIO 2: NAVBAR + HERO SECTION
   Tailwind CSS Version - JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initMobileMenu();
    initAnimations();
    initSmoothScroll();
});

/* ==================== NAVBAR SCROLL EFFECT ==================== */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.classList.add('bg-dark-900/95', 'backdrop-blur-xl', 'shadow-lg', 'py-3');
            navbar.classList.remove('py-4');
        } else {
            navbar.classList.remove('bg-dark-900/95', 'backdrop-blur-xl', 'shadow-lg', 'py-3');
            navbar.classList.add('py-4');
        }
    });
}

/* ==================== MOBILE MENU ==================== */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const icon = menuBtn.querySelector('i');
    
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        
        // Toggle icon
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('bi-x');
            icon.classList.add('bi-list');
        } else {
            icon.classList.remove('bi-list');
            icon.classList.add('bi-x');
        }
    });
    
    // Close menu when clicking on links
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            icon.classList.remove('bi-x');
            icon.classList.add('bi-list');
        });
    });
}

/* ==================== ENTRANCE ANIMATIONS ==================== */
function initAnimations() {
    const animatedElements = document.querySelectorAll('[class*="animate-"]');
    
    // Stagger animation for hero content
    const heroElements = document.querySelectorAll('section > div > div > div:first-child > *');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
    
    // Animate dashboard card
    const dashboardCard = document.querySelector('.bg-dark-800.rounded-2xl.border');
    if (dashboardCard) {
        dashboardCard.style.opacity = '0';
        dashboardCard.style.transform = 'translateY(30px)';
        dashboardCard.style.transition = 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s';
        
        setTimeout(() => {
            dashboardCard.style.opacity = '1';
            dashboardCard.style.transform = 'translateY(0)';
        }, 100);
    }
}

/* ==================== SMOOTH SCROLL ==================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==================== PARALLAX EFFECT ==================== */
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape-blur');
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 15;
        const currentTransform = getComputedStyle(shape).transform;
        shape.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

/* ==================== CONSOLE MESSAGE ==================== */
console.log(`
%c🎨 TechStartup Landing Page
%cEjercicio 2: Navbar + Hero Section (Tailwind CSS)

Clases Tailwind utilizadas:
• fixed, top-0, w-full, z-50
• flex, items-center, justify-between
• grid, grid-cols-1, lg:grid-cols-2
• text-4xl, sm:text-5xl, lg:text-6xl
• bg-dark-800, rounded-2xl, border
• hover:, transition-all, duration-300

¡Explora el código fuente! 📖
`, 
'font-size: 18px; font-weight: bold; color: #06b6d4;',
'font-size: 12px; color: #94a3b8;'
);
