// ============================================
// MAIN PAGE INTERACTIONS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeMainPage();
});

function initializeMainPage() {
    // Populate sections from data
    populateIntro();
    populateEducation();
    populateAwards();
    populateSocialLinks();
    
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

// ============================================
// SECTION POPULATION FUNCTIONS
// ============================================

function populateIntro() {
    const introContainer = document.getElementById('intro-container');
    
    const html = `
        <div class="intro-subsection intro-image">
            <img src="${intro.profileImage}" alt="Profile Picture">
        </div>
        <div class="intro-subsection intro-text">
            <h2>Welcome to My Portfolio</h2>
            <p>${intro.description}</p>
        </div>
    `;
    
    introContainer.innerHTML = html;
}

function populateEducation() {
    const educationContainer = document.getElementById('education-container');
    
    const html = education.map(edu => `
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

function populateAwards() {
    const awardsContainer = document.getElementById('awards-container');
    
    const html = awards.map(award => `
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

function populateSocialLinks() {
    const linksContainer = document.getElementById('links-container');
    
    const html = socialLinks.map(link => `
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

// Navigation active state
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.nav-menu a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});
