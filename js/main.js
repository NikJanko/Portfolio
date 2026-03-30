// ============================================
// MAIN PAGE INTERACTIONS
// ============================================

let portfolioData = null;
const MILESTONES_PAGE_SIZE = 1;
let milestonesPageIndex = 0;
let sortedMilestones = [];

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
    setupMobileExpandableDetails();
    
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
        ['milestones-container', 'Could not load content.json.'],
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

function toDateTimestamp(value) {
    if (!value) {
        return Number.NEGATIVE_INFINITY;
    }

    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) {
        return parsed;
    }

    const year = Number.parseInt(String(value).slice(0, 4), 10);
    if (Number.isFinite(year) && year > 0) {
        return Date.UTC(year, 0, 1);
    }

    return Number.NEGATIVE_INFINITY;
}

function formatMilestoneDate(dateAwarded) {
    const parsed = Date.parse(dateAwarded);
    if (!Number.isFinite(parsed)) {
        return dateAwarded || 'Unknown date';
    }

    return new Date(parsed).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function renderMilestonesPage() {
    const milestonesContainer = document.getElementById('milestones-container');
    if (!milestonesContainer) {
        return;
    }

    const total = sortedMilestones.length;
    if (!total) {
        milestonesContainer.innerHTML = '<p>No milestones available yet.</p>';
        return;
    }

    const totalPages = Math.ceil(total / MILESTONES_PAGE_SIZE);
    milestonesPageIndex = Math.max(0, Math.min(milestonesPageIndex, totalPages - 1));

    const start = milestonesPageIndex * MILESTONES_PAGE_SIZE;
    const end = Math.min(start + MILESTONES_PAGE_SIZE, total);
    const visibleMilestones = sortedMilestones.slice(start, end);
    const remaining = Math.max(0, total - end);
    const progressPercent = Math.round((end / total) * 100);

    const cardsHtml = visibleMilestones.map(milestone => `
        <div class="award-item">
            <div class="award-image">
                <img src="${milestone.image}" alt="${milestone.title}">
            </div>
            <div class="award-details">
                <h4>${milestone.title}</h4>
                <p class="award-meta">${milestone.issuer}</p>
                <p class="award-date">Awarded ${formatMilestoneDate(milestone.dateAwarded)}</p>
            </div>
        </div>
    `).join('');

    milestonesContainer.innerHTML = `
        <div class="milestones-carousel">
            <div class="milestones-cards">${cardsHtml}</div>
            <div class="milestones-controls" aria-label="Milestones carousel controls">
                <button type="button" class="milestones-btn" id="milestonesPrev" aria-label="Previous milestones" ${milestonesPageIndex === 0 ? 'disabled' : ''}><span class="triangle-left" aria-hidden="true"></span></button>
                <div class="milestones-progress-wrap">
                    <div class="milestones-progress-text">Showing ${start + 1}-${end} of ${total}</div>
                    <div class="milestones-progress-bar" aria-hidden="true">
                        <span style="width: ${progressPercent}%;"></span>
                    </div>
                        <!--  <div class="milestones-progress-remaining">${remaining} left to view</div> -->
                </div>
                <button type="button" class="milestones-btn" id="milestonesNext" aria-label="Next milestones" ${end >= total ? 'disabled' : ''}><span class="triangle-right" aria-hidden="true"></span></button>
            </div>
        </div>
    `;

    const prevButton = document.getElementById('milestonesPrev');
    const nextButton = document.getElementById('milestonesNext');

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            milestonesPageIndex -= 1;
            renderMilestonesPage();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            milestonesPageIndex += 1;
            renderMilestonesPage();
        });
    }
}

function populateAwards(awardsData) {
    sortedMilestones = [...(awardsData || [])].sort((a, b) => toDateTimestamp(b.dateAwarded) - toDateTimestamp(a.dateAwarded));
    milestonesPageIndex = 0;
    renderMilestonesPage();
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

function setupMobileExpandableDetails() {
    const isMobileViewport = () => window.matchMedia('(max-width: 768px)').matches;

    const collapseAll = (exceptItem = null) => {
        const expandableItems = document.querySelectorAll('.education-item');
        expandableItems.forEach(item => {
            if (item !== exceptItem) {
                item.classList.remove('expanded');
            }
        });
    };

    document.addEventListener('click', (event) => {
        if (!isMobileViewport()) {
            return;
        }

        const card = event.target.closest('.education-item');
        if (!card) {
            return;
        }

        const isExpanded = card.classList.contains('expanded');
        collapseAll(card);
        if (isExpanded) {
            card.classList.remove('expanded');
        } else {
            card.classList.add('expanded');
        }
    });

    window.addEventListener('resize', () => {
        if (!isMobileViewport()) {
            collapseAll();
        }
    });
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
