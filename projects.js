// ============================================
// PROJECTS PAGE FUNCTIONALITY
// ============================================

let currentFilter = 'all'; // all, past, current, future
let timelineEnabled = false;

document.addEventListener('DOMContentLoaded', function() {
    initializeProjectsPage();
});

function initializeProjectsPage() {
    setupToggle();
    setupTimeline();
    setupModal();
    
    // Check URL parameters for filter
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    if (filter && ['past', 'current', 'future'].includes(filter)) {
        currentFilter = filter;
        // Enable timeline and set appropriate position
        document.getElementById('timelineToggle').checked = true;
        toggleTimeline();
        
        // Set slider position based on filter
        const sliderValue = filter === 'past' ? 0 : filter === 'current' ? 1 : 2;
        document.getElementById('timelineSlider').value = sliderValue;
        updateTimelineFilter(sliderValue);
    } else {
        renderProjects('all');
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
    timelineEnabled = !timelineEnabled;
    const timelineBar = document.getElementById('timelineBar');
    const sectionHeaders = document.getElementById('sectionHeaders');
    
    if (timelineEnabled) {
        timelineBar.classList.remove('hidden');
        sectionHeaders.classList.add('hidden');
        currentFilter = 'current'; // Default to current when enabling timeline
        document.getElementById('timelineSlider').value = 1;
        updateTimelineFilter(1);
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
    const slider = document.getElementById('timelineSlider');
    slider.addEventListener('input', function(e) {
        updateTimelineFilter(parseInt(e.target.value));
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
        filter = 'past';
    } else if (value === 1) {
        filter = 'current';
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

function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.opacity = '0';
    card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
    
    const typeLabel = project.type.charAt(0).toUpperCase() + project.type.slice(1);
    
    card.innerHTML = `
        <div class="project-card-image-wrapper">
            <img src="${project.image}" alt="${project.title}" class="project-card-image">
            <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link-icon" title="Visit Project">
                <span>🔗</span>
            </a>
        </div>
        <div class="project-card-content">
            <div class="project-card-status ${project.type}">${typeLabel}</div>
            <h3 class="project-card-title">${project.title}</h3>
            <p class="project-card-description">${project.summary}</p>
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
    
    // Populate modal with project data
    document.getElementById('modalImage').src = project.image;
    document.getElementById('modalImage').alt = project.title;
    document.getElementById('modalTitle').textContent = project.title;
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
