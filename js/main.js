// ============================================
// MAIN PAGE INTERACTIONS
// ============================================

let portfolioData = null;

document.addEventListener('DOMContentLoaded', async function() {
    setupHamburgerMenu();
    await initializeMainPage();
});

async function initializeMainPage() {
    portfolioData = await loadPortfolioData();
    if (!portfolioData) {
        renderDataLoadError();
        return;
    }

    // Populate sections from data
    populateIntro(portfolioData.intro);
    populateEducation(portfolioData.education);
    populateAwards(portfolioData.awards);
    populateSocialLinks(portfolioData.socialLinks);
    
    // Smooth scroll is handled by CSS scroll-behavior property
    
    // Add animation to section titles on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all section titles
    document.querySelectorAll('.section-title').forEach(title => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(20px)';
        title.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(title);
    });

    // Observe all cards for animation
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1
    });

    // Apply animation to various card elements
    setTimeout(() => {
        document.querySelectorAll('.education-item, .award-item, .project-link-card, .media-link').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            cardObserver.observe(card);
        });
    }, 100);
}

async function loadPortfolioData() {
    try {
        const response = await fetch('../data/content.json');
        if (!response.ok) {
            throw new Error('Unable to load content.json');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

function renderDataLoadError() {
    const placeholders = [
        ['intro-container', 'Could not load content.json.'],
        ['education-container', 'Could not load content.json.'],
        ['awards-container', 'Could not load content.json.'],
        ['links-container', 'Could not load content.json.']
    ];

    placeholders.forEach(([id, message]) => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = `<p>${message}</p>`;
        }
    });
}

// ============================================
// SECTION POPULATION FUNCTIONS
// ============================================

function populateIntro(introData) {
    const introContainer = document.getElementById('intro-container');
    
    const html = `
        <div class="intro-subsection intro-image">
            <img src="${introData.profileImage}" alt="Profile Picture">
        </div>
        <div class="intro-subsection intro-text">
            <h2>Welcome to My Portfolio</h2>
            <p>${introData.description}</p>
        </div>
    `;
    
    introContainer.innerHTML = html;
}

function populateEducation(educationData) {
    const educationContainer = document.getElementById('education-container');
    
    const html = educationData.map(edu => `
        <div class="education-item">
            <div class="education-image">
                <img src="${edu.image}" alt="${edu.institution}">
            </div>
            <div class="education-details">
                <h3>${edu.title}</h3>
                <p>${edu.subject}</p>
                <p>${edu.institution} | ${edu.duration}</p>
                <p>${edu.coursework ? 'Relevant coursework: ' + edu.coursework.join(', ') : ''}${edu.focus ? 'Focus: ' + edu.focus.join(', ') : ''}</p>
            </div>
        </div>
    `).join('');
    
    educationContainer.innerHTML = html;
}

function populateAwards(awardsData) {
    const awardsContainer = document.getElementById('awards-container');
    
    const html = awardsData.map(award => `
        <div class="award-item">
            <div class="award-image">
                <img src="${award.image}" alt="${award.title}">
            </div>
            <div class="award-details">
                <h4>${award.title}</h4>
                <p>${award.issuer}</p>
            </div>
        </div>
    `).join('');
    
    awardsContainer.innerHTML = html;
}

function populateSocialLinks(socialLinksData) {
    const linksContainer = document.getElementById('links-container');
    
    const html = socialLinksData.map(link => `
        <a href="${link.url}" class="media-link" target="_blank" rel="noopener noreferrer">
            <img src="${link.image}" alt="${link.platform}">
            <span>${link.platform}</span>
        </a>
    `).join('');
    
    linksContainer.innerHTML = html;
}

// ============================================
// NAVIGATION
// ============================================

// Hamburger Menu Setup
function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = navMenu.querySelectorAll('a');

    // Toggle hamburger menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Navigation active state
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.nav-menu a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});
