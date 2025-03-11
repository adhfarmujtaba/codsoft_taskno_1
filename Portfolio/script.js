// Constants for DOM element IDs
const ELEMENTS = {
    HEADER: 'header',
    DEV_NAME: 'devName',
    HAMBURGER: 'hambugger',
    SIDE_MENU: 'sideMenu',
    MAIN: 'main',
    SIDE_MENU_CLOSE: 'sideMenuClose',
    HIRE_ME_BTN: 'hireMe',
    HIRE_ME_MODAL: 'modelHireMe',
    HIRE_ME_CONTENT: 'hireMeContent',
    ABOUT_SECTION: 'about',
    SKILLS_SECTION: 'skills',
    RESUME_CONTAINER_CLASS: 'resume-container',
    CLOSE_BTN_HIRE_ME: 'closeMeBtn',
    SIDE_MENU_LINK: 'sideMenuLink',
    ARROW_TOP: 'arrowTop',
};

// Debounce function
const debounce = (func, wait) => {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
};

// Cache DOM elements and return them
const cacheElements = () => {
    const elements = {};
    
    for (const [key, id] of Object.entries(ELEMENTS)) {
        if (key === 'RESUME_CONTAINER_CLASS') {
            elements[key] = document.querySelector(`.${id}`);
        } else if (key === 'HIRE_ME_BTN' || key === 'SIDE_MENU_LINK') {
            elements[key] = document.querySelectorAll(`#${id}`);
        } else {
            elements[key] = document.getElementById(id);
        }
    }
    
    return elements;
};

// Scroll event handlers
const setupScrollListeners = (elements) => {
    const scrollHandler = debounce(() => {
        toggleHeaderVisibility(elements.DEV_NAME, elements.HEADER);
    }, 10);

    window.addEventListener('scroll', scrollHandler);
    toggleHeaderVisibility(elements.DEV_NAME, elements.HEADER);
};

const toggleHeaderVisibility = (devName, header) => {
    if (!devName || !header) return;
    
    const devNamePosition = devName.getBoundingClientRect().top;
    const visibilityThreshold = -4;

    if (devNamePosition <= visibilityThreshold) {
        header.classList.add('sticky');
        devName.classList.add('hide');
    } else {
        header.classList.remove('sticky');
        devName.classList.remove('hide');
    }
};

// Side menu functionality
const setupSideMenu = (elements) => {
    const { HAMBURGER, SIDE_MENU, SIDE_MENU_CLOSE, MAIN, SIDE_MENU_LINK } = elements;
    
    if (!HAMBURGER || !SIDE_MENU || !SIDE_MENU_CLOSE || !MAIN) return;
    
    const toggleSideMenu = () => {
        SIDE_MENU.classList.toggle('show');
        MAIN.classList.toggle('shrink');
        document.body.style.overflow = SIDE_MENU.classList.contains('show') ? 'hidden' : '';
        document.body.style.background = SIDE_MENU.classList.contains('show') ? 'rgba(0, 0, 0, 0.5)' : '';
    };
    
    HAMBURGER.addEventListener('click', toggleSideMenu);
    SIDE_MENU_CLOSE.addEventListener('click', toggleSideMenu);
    
    if (SIDE_MENU_LINK) {
        SIDE_MENU_LINK.forEach((link) => {
            link.addEventListener('click', () => {
                SIDE_MENU.classList.remove('show');
                MAIN.classList.remove('shrink');
                document.body.style.overflow = '';
                document.body.style.background = '';
            });
        });
    }
};

// Hire me modal functionality
const setupHireMeModal = (elements) => {
    const { HIRE_ME_BTN, HIRE_ME_MODAL, HIRE_ME_CONTENT, CLOSE_BTN_HIRE_ME } = elements;
    
    if (!HIRE_ME_BTN || !HIRE_ME_MODAL || !HIRE_ME_CONTENT || !CLOSE_BTN_HIRE_ME) return;
    
    let touchStartY = 0;
    let touchEndY = 0;
    
    // Open modal
    HIRE_ME_BTN.forEach(button => {
        button.addEventListener('click', () => {
            HIRE_ME_MODAL.classList.remove('hide');
            HIRE_ME_MODAL.classList.add('show');
            setTimeout(() => {
                HIRE_ME_CONTENT.classList.add('show');
                HIRE_ME_CONTENT.classList.remove('hide');                
            }, 700);
            document.body.style.overflow = 'hidden';
        });
    });
  
    CLOSE_BTN_HIRE_ME.addEventListener('click', () => closeHireMeModal(HIRE_ME_MODAL, HIRE_ME_CONTENT));
    
    // Close modal on background click
    HIRE_ME_MODAL.addEventListener('click', (e) => {
        closeHireMeModal(HIRE_ME_MODAL, HIRE_ME_CONTENT);
        e.stopPropagation();
    });
    
    // Prevent clicks inside content from closing
    HIRE_ME_CONTENT.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Swipe down to close
    HIRE_ME_CONTENT.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    HIRE_ME_CONTENT.addEventListener('touchmove', (e) => {
        touchEndY = e.changedTouches[0].screenY;
    });
    
    HIRE_ME_CONTENT.addEventListener('touchend', () => {
        if (touchEndY > touchStartY + 50) {
            closeHireMeModal(HIRE_ME_MODAL, HIRE_ME_CONTENT);
        }
    });
};

const closeHireMeModal = (modal, modalContent) => {
    if (!modal || !modalContent) return;
    
    modal.classList.remove('show');
    modal.classList.add('hide');
    modalContent.classList.remove('show');
    modalContent.classList.add('hide');
    document.body.style.overflow = '';
};

// Smooth scrolling for internal links
const setupSmoothScroll = () => {
    const OFFSET = 75;
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - OFFSET,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Unified animation configuration
const ANIMATION_CONFIG = {
// About section animations
    about: {
        section: { class: 'fadeInVisible', threshold: 0.02 },
        elements: [
            { selector: 'h2', class: 'fadeInHeading', threshold: 0.1 },
            { selector: 'p', class: 'fadeInParagraph', threshold: 0.1 },
            { selector: '.detail-section', class: 'fadeInDetailSection', threshold: 0.1 },
            { selector: '.detail-img', class: 'fadeInImage', threshold: 0.1 },
            { selector: '.info', class: 'fadeInInfo', threshold: 0.1 },
            { selector: '.profile-info p', class: 'fadeInVisible', threshold: 0.1 }
        ]
    },
// Skills section animations
    skills: {
        section: { class: 'fadeInSkills', threshold: 0.05 },
        elements: [
            { selector: '.skill', class: 'fadeInSkillBar', threshold: 0.5, isStaggered: true }
        ]
    },
// Resume section animations
    resume: {
        section: { class: 'fadeInResumeContainer', threshold: 0.02 },
        elements: [
            { selector: '.resume-title, .resume-section', class: 'show', threshold: 0.1 },
            { selector: '.timeline', class: 'show', threshold: 0.1 },
            { selector: '.timeline-item', class: 'visible', threshold: 0.1, isStaggered: true }
        ]
    },
// Projects section animations
    projects: {
        section: { class: 'fadeInProjects', threshold: 0.2 },
        elements: [
            { selector: '.project-card', class: 'fadeInProject', threshold: 0.1, isStaggered: true },
            { selector: '.project-title, .project-description, .project-links, .project-image', class: 'fadeInProjectElement', threshold: 0.1, isStaggered: true }
        ]
    }
};

//Single IntersectionObserver for animations
const createAnimationObserver = (callback, options = {}) => {
    const defaultOptions = { threshold: 0.1, rootMargin: '0px' };
    const mergedOptions = { ...defaultOptions, ...options };
    return new IntersectionObserver(callback, mergedOptions);
};

// Handle animations for skills section progress bars
const animateSkillBar = (skillElement, isVisible) => {
    const progressBar = skillElement.querySelector('.skill-progress');
    if (!progressBar) return;
    
    const percentEl = skillElement.querySelector('[data-percent]');
    if (!percentEl) return;
    
    const percent = percentEl.getAttribute('data-percent');
    
    if (isVisible) {
        // Reset
        progressBar.style.width = '0';
        setTimeout(() => {
            progressBar.style.width = percent;
        }, 300);
    } else {
        progressBar.style.width = '0';
    }
};

// Setup all section animations
const setupAnimations = () => {
    // Process each section defined in ANIMATION_CONFIG
    Object.entries(ANIMATION_CONFIG).forEach(([sectionKey, config]) => {
        const sectionElement = sectionKey === 'resume' 
            ? document.querySelector('.resume-container')
            : document.querySelector(sectionKey === 'projects' ? '.projects-section' : `#${sectionKey}`);
        
        if (!sectionElement) return;
        
        const sectionObserver = createAnimationObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        sectionElement.classList.add(config.section.class);
                        
// For skills section, special handling for progress bars reset
                        if (sectionKey === 'skills' && !entry.isIntersecting) {
                            const skillElements = sectionElement.querySelectorAll('.skill');
                            skillElements.forEach(skill => animateSkillBar(skill, false));
                        }
                    } else {
                        sectionElement.classList.remove(config.section.class);
                    }
                });
            },
            { threshold: config.section.threshold }
        );
        
        sectionObserver.observe(sectionElement);
        
// Process elements within the section
        config.elements.forEach(elementConfig => {
            const elements = sectionElement.querySelectorAll(elementConfig.selector);
            
// Set indices for staggered animations if needed
            if (elementConfig.isStaggered) {
                elements.forEach((el, index) => {
                    el.style.setProperty('--i', index);
                    el.style.setProperty('--index', index);
                });
            }
            
// Create observer for elements
            const elementObserver = createAnimationObserver(
                (entries) => {
                    entries.forEach(entry => {
                        const el = entry.target;
                        
                        if (entry.isIntersecting) {
                            if (elementConfig.isStaggered) {
                                const index = parseInt(el.style.getPropertyValue('--i') || 0);
                                setTimeout(() => {
                                    el.classList.add(elementConfig.class);
                                }, index * 200);
                            } else {
                                el.classList.add(elementConfig.class);
                            }
                            
                            // Special handling for skill bars
                            if (sectionKey === 'skills' && el.classList.contains('skill')) {
                                animateSkillBar(el, true);
                            }
                        } else {
                            el.classList.remove(elementConfig.class);
                            
                            // Reset skill bars when no longer visible
                            if (sectionKey === 'skills' && el.classList.contains('skill')) {
                                animateSkillBar(el, false);
                            }
                        }
                    });
                },
                { 
                    threshold: elementConfig.threshold || 0.1,
                    rootMargin: elementConfig.rootMargin || '0px'
                }
            );
            
            // Observe each element
            elements.forEach(el => elementObserver.observe(el));
        });
    });
};

// Update active navigation item based on scroll position
const updateActiveNavOnScroll = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    if (!sections.length || !navLinks.length) return;
    
    const scrollHandler = debounce(() => {
        let maxVisibleSection = null;
        let maxVisiblePercentage = 0;
        const viewportHeight = window.innerHeight;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
            const visiblePercentage = visibleHeight > 0 ? visibleHeight / rect.height : 0;
            
            if (visiblePercentage > maxVisiblePercentage) {
                maxVisiblePercentage = visiblePercentage;
                maxVisibleSection = section;
            }
        });
        
        if (maxVisibleSection && maxVisiblePercentage > 0.1) {
            const sectionId = maxVisibleSection.getAttribute('id');
            
            navLinks.forEach(link => {
                link.parentElement.classList.remove('active');
            });
            
            const activeLink = document.querySelector(`nav ul li a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.parentElement.classList.add('active');
            }
        }
    }, 100);
    
    window.addEventListener('scroll', scrollHandler);
};

// Scroll to top button functionality
const setupScrollToTop = (elements) => {
    const { ARROW_TOP } = elements;
    if (!ARROW_TOP) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            ARROW_TOP.classList.add('show'); 
        } else {
            ARROW_TOP.classList.remove('show'); 
        }
    });

    ARROW_TOP.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
    });
};

// window orientation changes
const setupOrientationChangeHandler = () => {
    window.addEventListener('orientationchange', () => {
// very little delay to allow layout to settle
        setTimeout(() => {
// Find all skills and reset progress bars
            const skillElements = document.querySelectorAll('.skill');
            skillElements.forEach(skill => {
                const progressBar = skill.querySelector('.skill-progress');
                if (progressBar) {
                    progressBar.style.width = '0';
// Re-trigger animation if skill is in view
                    if (skill.classList.contains('fadeInSkillBar')) {
                        const percentEl = skill.querySelector('[data-percent]');
                        if (percentEl) {
                            const percent = percentEl.getAttribute('data-percent');
                            setTimeout(() => {
                                progressBar.style.width = percent;
                            }, 300);
                        }
                    }
                }
            });
        }, 200);
    });
};

// Initialization function
const init = () => {
    const elements = cacheElements();
    
    setupScrollListeners(elements);
    setupSideMenu(elements);
    setupHireMeModal(elements);
    setupSmoothScroll();
    setupScrollToTop(elements);
    setupOrientationChangeHandler();
    
    // Replace all individual observers with unified animation system
    setupAnimations();
    updateActiveNavOnScroll();
};

document.addEventListener('DOMContentLoaded', init);