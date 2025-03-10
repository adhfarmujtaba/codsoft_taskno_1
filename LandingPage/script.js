// Constants for DOM element IDs
const ELEMENTS = {
    navLinks: 'nav ul li a',
    sections: 'section',
    modal: '#quoteModal',
    quoteButton: '#quoteButton', 
    hamburger: '.hambugger',
    mobileMenu: '.mobile-menu',
    closeMenu: '.close-menu',
    mobileNavLinks: '.mobile-menu ul li a',
    homeLinks: '#top',
    header: '#header',
};

// Cached DOM elements
const DOM = {};

// Debounce function
function debounce(func, wait = 100) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Main initialization function
function init() {
    // Cache DOM elements
    for (const [key, selector] of Object.entries(ELEMENTS)) {
        if (selector.startsWith('#')) {
            DOM[key] = document.getElementById(selector.substring(1));
        } else {
            const elements = document.querySelectorAll(selector);
            DOM[key] = elements.length === 1 ? elements[0] : elements;
        }
    }

    //  smooth scrolling for anchor links
    setupSmoothScrolling();
    
    //  scroll event for navigation active
    setupScrollHandling();
    
    //  modal functionality if modal elements exist
    if (DOM.modal && DOM.quoteButton) {
        setupModal();
    }
    
    //  mobile menu if elements exist
    if (DOM.hamburger && DOM.mobileMenu && DOM.closeMenu) {
        setupMobileMenu();
    }
    
    //  home links if they exist
    if (DOM.homeLinks && DOM.homeLinks.length) {
        setupHomeLinks();
    }
}

//  smooth scrolling for all anchor links
function setupSmoothScrolling() {    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                let headerOffset = 50; // Default offset
                
                // If scrolling up, use 70px offset
                if (currentScrollTop > targetSection.offsetTop) {
                    headerOffset = 120;
                }
                
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Handle scroll events to highlight active navigation
function handleScroll() {
    let currentSection = null;
    let maxVisibleArea = 0;
    
    DOM.sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const visibleArea = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        
        if (visibleArea > maxVisibleArea && visibleArea > 0) {
            maxVisibleArea = visibleArea;
            currentSection = section;
        }
    });
    
    if (currentSection) {
        // Remove active class from all nav links first
        DOM.navLinks.forEach(link => {
            link.parentElement.classList.remove('active');
        });
        
        // Then add active class only to the current section's link
        const activeLink = document.querySelector(`nav ul li a[href="#${currentSection.id}"]`);
        if (activeLink) {
            activeLink.parentElement.classList.add('active');
        }
    }
}

// Setup scroll handling with debounce 
function setupScrollHandling() {
    let lastScrollTop = 0;
    
    function handleHeaderOnScroll() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScrollTop < lastScrollTop && currentScrollTop > 0) {
            DOM.header.classList.add('top'); 
        } 
        else {
            DOM.header.classList.remove('top'); 
        }
        
        lastScrollTop = currentScrollTop;
    }
    
    const debouncedHandleScroll = debounce(handleScroll, 50);
    const debouncedHandleHeaderScroll = debounce(handleHeaderOnScroll, 10);
    
    window.addEventListener('scroll', () => {
        debouncedHandleScroll();
        debouncedHandleHeaderScroll();
    });
    
    window.addEventListener('load', () => {
        handleScroll();
        handleHeaderOnScroll();
    });
}

// modal functionality
function setupModal() {
    if (DOM.quoteButton && typeof DOM.quoteButton.addEventListener === 'function') {
        DOM.quoteButton.addEventListener("click", e => {
            e.preventDefault();
            DOM.modal.classList.add('show');
        });
        
        window.addEventListener("click", e => {
            if (e.target === DOM.modal) {
                DOM.modal.classList.remove('show');
            }
        });
        
        // Add swipe down to close functionality
        let touchStartY = 0;
        let touchEndY = 0;
        
        DOM.modal.addEventListener('touchstart', e => {
            touchStartY = e.changedTouches[0].screenY;
        }, false);
        
        DOM.modal.addEventListener('touchend', e => {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const swipeDistance = touchEndY - touchStartY;
            if (swipeDistance > 50) { 
                DOM.modal.classList.remove('show');
            }
        }
    } else {
        console.warn('Quote button not found');
    }
}

// mobile menu functionality
function setupMobileMenu() {
    DOM.hamburger.addEventListener('click', () => {
        DOM.mobileMenu.classList.toggle('show');
    });
    
    DOM.closeMenu.addEventListener('click', () => {
        DOM.mobileMenu.classList.toggle('show');
    });
    
    if (DOM.mobileNavLinks instanceof NodeList) {
        DOM.mobileNavLinks.forEach(item => {
            item.addEventListener('click', () => {
                DOM.mobileMenu.classList.toggle('show');
            });
        });
    }
}

// Setup home links
function setupHomeLinks() {
    if (DOM.homeLinks instanceof NodeList) {
        DOM.homeLinks.forEach(home => {
            home.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    } else if (DOM.homeLinks) {
        DOM.homeLinks.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);