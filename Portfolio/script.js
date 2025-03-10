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

// Section animation helpers
const animateWithDelay = (element, className, delay) => {
    if (!element) return;
    setTimeout(() => {
        element.classList.add(className);
    }, delay);
};

// About section animation
const setupAboutSectionObserver = () => {
    const aboutSection = document.querySelector('.about');
    if (!aboutSection) return;
    
    const aboutElements = {
        heading: document.querySelector('.about h2'),
        paragraph: document.querySelector('.about p'),
        detailSection: document.querySelector('.about .detail-section'),
        detailImg: document.querySelector('.about .detail-img'),
        info: document.querySelector('.about .info'),
        profileInfo: document.querySelectorAll('.profile-info p')
    };
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateAboutSection(aboutSection, aboutElements, true);
            } else {
                animateAboutSection(aboutSection, aboutElements, false);
            }
        });
    }, { threshold: 0.02 });
    
    observer.observe(aboutSection);
};

const animateAboutSection = (section, elements, isVisible) => {
    if (!section) return;
    
    if (isVisible) {
        section.classList.add('fadeInVisible');
        animateWithDelay(elements.heading, 'fadeInHeading', 100);
        animateWithDelay(elements.paragraph, 'fadeInParagraph', 300);
        animateWithDelay(elements.detailSection, 'fadeInDetailSection', 500);
        animateWithDelay(elements.detailImg, 'fadeInImage', 700);
        animateWithDelay(elements.info, 'fadeInInfo', 900);
        
        if (elements.profileInfo) {
            elements.profileInfo.forEach((p, index) => {
                animateWithDelay(p, 'fadeInVisible', 1100 + (index * 150));
            });
        }
    } else {
        section.classList.remove('fadeInVisible');
        if (elements.heading) elements.heading.classList.remove('fadeInHeading');
        if (elements.paragraph) elements.paragraph.classList.remove('fadeInParagraph');
        if (elements.detailSection) elements.detailSection.classList.remove('fadeInDetailSection');
        if (elements.detailImg) elements.detailImg.classList.remove('fadeInImage');
        if (elements.info) elements.info.classList.remove('fadeInInfo');
        if (elements.profileInfo) {
            elements.profileInfo.forEach(p => p.classList.remove('fadeInVisible'));
        }
    }
};

// Skills section animation
const setupSkillsSectionObserver = () => {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    
    const skillItems = document.querySelectorAll('.skill');
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillItems.forEach((item, index) => {
        item.style.setProperty('--i', index);
    });
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillsSection.classList.add('fadeInSkills');
                
                skillItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('fadeInSkillBar');
                    }, 300 * index);
                });
                
                skillBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const percent = bar.parentElement.previousElementSibling?.getAttribute('data-percent');
                        if (percent) bar.style.width = percent;
                    }, 200 + (500 * index));
                });
            } else {
                skillsSection.classList.remove('fadeInSkills');
                skillItems.forEach(item => item.classList.remove('fadeInSkillBar'));
                skillBars.forEach(bar => { bar.style.width = '0'; });
            }
        });
    }, { threshold: 0.02 });
    
    observer.observe(skillsSection);
};

// Resume section animation
const setupResumeSectionObserver = () => {
    const resumeContainer = document.querySelector('.resume-container');
    if (!resumeContainer) return;
    
    const timelineItems = document.querySelectorAll('.timeline');
    
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.style.setProperty('--index', index);
    });
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                resumeContainer.classList.add('fadeInResumeContainer');
                
                setTimeout(() => {
                    resumeContainer.querySelectorAll('.resume-title, .resume-section').forEach(element => 
                        element.classList.add('show')
                    );
                    timelineItems.forEach(item => item.classList.add('show'));
                }, 300);
            } else {
                resumeContainer.classList.remove('fadeInResumeContainer');
                
                resumeContainer.querySelectorAll('.resume-title, .resume-section').forEach(element => 
                    element.classList.remove('show')
                );
                timelineItems.forEach(item => item.classList.remove('show'));
            }
        });
    }, { threshold: 0.02 });
    
    observer.observe(resumeContainer);
};

// Project section animation
const setupProjectSectionObserver = () => {
    const projectSection = document.querySelector('.projects-section');
    if (!projectSection) return;
    
    const projectCards = document.querySelectorAll('.project-card');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                projectSection.classList.add('fadeInProjects');
                
                projectCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('fadeInProject');
                    }, index * 200);
                });
            } else {
                projectSection.classList.remove('fadeInProjects');
                projectCards.forEach(card => card.classList.remove('fadeInProject'));
            }
        });
    }, { threshold: 0.2 });

    observer.observe(projectSection);
};

// Section Intersection Observers
const setupIntersectionObservers = () => {
    setupAboutSectionObserver();
    setupSkillsSectionObserver();
    setupResumeSectionObserver();
    setupProjectSectionObserver();
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

// Initialization function
const init = () => {
    const elements = cacheElements();
    
    setupScrollListeners(elements);
    setupSideMenu(elements);
    setupHireMeModal(elements);
    setupSmoothScroll();
    setupScrollToTop(elements);
    setupIntersectionObservers();
    updateActiveNavOnScroll();
};

document.addEventListener('DOMContentLoaded', init);