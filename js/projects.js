// ============================================
// PROJECTS PAGE FUNCTIONALITY
// ============================================

let projects = [];
let currentFilter = 'all'; // all, dead, past, present, future
let timelineEnabled = false;
let selectedTimelineIndex = 2;

document.addEventListener('DOMContentLoaded', async function() {
    await initializeProjectsPage();
    setupHamburgerMenu();
});

async function initializeProjectsPage() {
    projects = await loadProjectsData();

    setupToggle();
    setupTimeline();
    setupModal();
    
    // Check URL parameters for filter
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    if (filter && ['dead', 'past', 'current', 'present', 'future'].includes(filter)) {
        currentFilter = filter === 'current' ? 'present' : filter;
        // Enable timeline and set appropriate position
        document.getElementById('timelineToggle').checked = true;
        toggleTimeline();
        
        // Set slider position based on filter
        const normalizedFilter = filter === 'current' ? 'present' : filter;
        const indexMap = { dead: 0, past: 1, present: 2, future: 3 };
        selectedTimelineIndex = indexMap[normalizedFilter];
        updateTimelineFilter(selectedTimelineIndex);
    } else {
        renderProjects('all');
    }
}

async function loadProjectsData() {
    try {
        const response = await fetch('../data/content.json');
        if (!response.ok) {
            throw new Error('Unable to load content.json');
        }
        const data = await response.json();
        return Array.isArray(data.projects) ? data.projects : [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

// ============================================
// TOGGLE SETUP
// ============================================
function setupToggle() {
    const toggle = document.getElementById('timelineToggle');
    toggle.addEventListener('change', toggleTimeline);
}

function toggleTimeline() {
    timelineEnabled = document.getElementById('timelineToggle').checked;
    const timelineBar = document.getElementById('timelineBar');
    const sectionHeaders = document.getElementById('sectionHeaders');
    
    if (timelineEnabled) {
        timelineBar.classList.remove('hidden');
        sectionHeaders.classList.add('hidden');
        currentFilter = 'present'; // Default to present when enabling timeline
        updateTimelineFilter(selectedTimelineIndex);
    } else {
        timelineBar.classList.add('hidden');
        sectionHeaders.classList.remove('hidden');
        renderProjects('all');
    }
}

// ============================================
// TIMELINE SETUP
// ============================================
function setupTimeline() {
    const sections = document.querySelectorAll('.timeline-section');
    sections.forEach((section, index) => {
        section.addEventListener('click', () => {
            selectedTimelineIndex = index;
            updateTimelineFilter(index);
        });
    });
}

function updateTimelineFilter(value) {
    // Update visual indicators
    const sections = document.querySelectorAll('.timeline-section');
    sections.forEach((section, index) => {
        section.classList.remove('active');
        if (index === value) {
            section.classList.add('active');
        }
    });
    
    // Determine which filter to apply
    let filter;
    if (value === 0) {
        filter = 'dead';
    } else if (value === 1) {
        filter = 'past';
    } else if (value === 2) {
        filter = 'present';
    } else {
        filter = 'future';
    }
    
    currentFilter = filter;
    renderProjects(filter);
}

// ============================================
// RENDER PROJECTS
// ============================================
function renderProjects(filter) {
    const grid = document.getElementById('projectsGrid');
    const sectionHeaders = document.getElementById('sectionHeaders');

    // Standard mode: show projects grouped under Dead/Past/Present/Future areas.
    if (filter === 'all') {
        renderGroupedProjects();
        grid.classList.add('hidden');
        sectionHeaders.classList.remove('hidden');
        return;
    }

    // Timeline mode: show a single filtered grid.
    grid.classList.remove('hidden');
    grid.innerHTML = '';
    
    // Filter projects
    let filteredProjects = projects;
    if (filter !== 'all') {
        filteredProjects = projects.filter(p => p.type === filter);
    }
    
    // Create and append project cards
    filteredProjects.forEach((project, index) => {
        const card = createProjectCard(project, index);
        grid.appendChild(card);
    });
    
    // If no projects, show message
    if (filteredProjects.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; font-size: 1.1rem; color: #999;">No projects found in this category.</p>';
    }
}

function renderGroupedProjects() {
    const sectionHeaders = document.getElementById('sectionHeaders');
    const groups = [
        { type: 'present', title: 'Present Projects' },
        { type: 'past', title: 'Past Projects' },
        { type: 'future', title: 'Future Projects' },
        { type: 'dead', title: 'Dead Projects' }
    ];

    sectionHeaders.innerHTML = '';

    groups.forEach(group => {
        const section = document.createElement('div');
        section.className = 'section-header';

        const heading = document.createElement('h3');
        heading.textContent = group.title;
        section.appendChild(heading);

        const groupGrid = document.createElement('div');
        groupGrid.className = 'projects-grid section-projects-grid';

        const groupProjects = projects.filter(project => project.type === group.type);
        if (groupProjects.length === 0) {
            const empty = document.createElement('p');
            empty.textContent = `No ${group.type} projects yet.`;
            empty.style.gridColumn = '1/-1';
            empty.style.textAlign = 'center';
            empty.style.color = '#999';
            groupGrid.appendChild(empty);
        } else {
            groupProjects.forEach((project, index) => {
                const card = createProjectCard(project, index);
                groupGrid.appendChild(card);
            });
        }

        section.appendChild(groupGrid);
        sectionHeaders.appendChild(section);
    });
}

function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.opacity = '0';
    card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
    
    const typeLabel = project.type.charAt(0).toUpperCase() + project.type.slice(1);
    
    card.innerHTML = `
        <div class="project-card-image-wrapper">
            <img src="${project.image}" alt="${project.title}" class="project-card-image">
        </div>
        <div class="project-card-content">
            <div class="project-card-status ${project.type}">${typeLabel}</div>
            <h3 class="project-card-title">${project.title}</h3>
            <p class="project-card-description">${project.cardSummary}</p>
        </div>
    `;
    
    card.addEventListener('click', () => openModal(project));
    
    return card;
}

// ============================================
// MODAL FUNCTIONALITY
// ============================================
function setupModal() {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.modal-close');
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal(project) {
    const modal = document.getElementById('projectModal');
    const modalProjectLink = document.getElementById('modalProjectLink');
    
    // Populate modal with project data
    document.getElementById('modalImage').src = project.image;
    document.getElementById('modalImage').alt = project.title;
    document.getElementById('modalTitle').textContent = project.title;
    modalProjectLink.href = project.link;
    modalProjectLink.setAttribute('aria-label', `Visit ${project.title}`);
    document.getElementById('modalSummary').textContent = project.summary;
    document.getElementById('modalChallenges').textContent = project.challenges;
    
    // Populate tools
    const toolsContainer = document.getElementById('modalTools');
    toolsContainer.innerHTML = '';
    project.tools.forEach(tool => {
        const toolTag = document.createElement('span');
        toolTag.className = 'tool-tag';
        toolTag.textContent = tool;
        toolsContainer.appendChild(toolTag);
    });
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeModal() {
    const modal = document.getElementById('projectModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// ============================================
// HAMBURGER MENU SETUP
// ============================================
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

// ============================================
// ANIMATION KEYFRAMES (added via CSS)
// ============================================
// Add fadeIn animation to document
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
