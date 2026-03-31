// ============================================
// BLOG PAGE FUNCTIONALITY
// ============================================

let allPosts = [];
let filteredPosts = [];
let selectedTag = null;
let selectedCategories = [];
let selectedYear = null;
let selectedMonth = null;
let currentImages = [];
let currentImageIndex = 0;
let categoryDropdownInitialized = false;
let postCanvasAnimationFrame = null;

document.addEventListener('DOMContentLoaded', async function() {
    setupNavHamburger();
    setupArchiveSidebarToggle();
    setupFocusOverlayControls();
    setupGalleryControls();
    await initializeBlogPage();
});

async function initializeBlogPage() {
    try {
        const response = await fetch('../data/blog-data.json');
        if (!response.ok) {
            throw new Error('Unable to read blog-data.json');
        }

        allPosts = await response.json();
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        renderArchiveTree();
        renderTagFilters();
        renderCategoryFilters();
        applyFilters();
    } catch (error) {
        const container = document.getElementById('blogCards');
        container.innerHTML = '<div class="blog-empty">Could not load blog-data.json. Start a local web server (for example, VS Code Live Server) and try again.</div>';
    }
}

function setupNavHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

function setupArchiveSidebarToggle() {
    const toggle = document.getElementById('archiveToggle');
    const sidebar = document.getElementById('blogSidebar');
    const backdrop = document.getElementById('archiveBackdrop');

    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        backdrop.classList.toggle('open');
    });

    backdrop.addEventListener('click', () => {
        sidebar.classList.remove('open');
        backdrop.classList.remove('open');
    });
}

function setupFocusOverlayControls() {
    const overlay = document.getElementById('blogFocusOverlay');
    const closeBtn = document.getElementById('blogFocusClose');

    closeBtn.addEventListener('click', closeFocusOverlay);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeFocusOverlay();
        }
    });
}

function setupGalleryControls() {
    document.getElementById('galleryClose').addEventListener('click', closeGalleryOverlay);
    document.getElementById('imageViewerClose').addEventListener('click', closeImageViewer);
    document.getElementById('viewerPrev').addEventListener('click', () => moveViewer(-1));
    document.getElementById('viewerNext').addEventListener('click', () => moveViewer(1));

    document.getElementById('galleryOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'galleryOverlay') {
            closeGalleryOverlay();
        }
    });

    document.getElementById('imageViewer').addEventListener('click', (e) => {
        if (e.target.id === 'imageViewer') {
            closeImageViewer();
        }
    });
}

function renderArchiveTree() {
    const tree = document.getElementById('archiveTree');
    const map = new Map();

    allPosts.forEach(post => {
        const date = new Date(post.date);
        const year = String(date.getFullYear());
        const month = date.toLocaleString('default', { month: 'long' });

        if (!map.has(year)) {
            map.set(year, new Map());
        }

        const monthMap = map.get(year);
        monthMap.set(month, (monthMap.get(month) || 0) + 1);
    });

    const years = Array.from(map.keys()).sort((a, b) => Number(b) - Number(a));

    tree.innerHTML = '';

    const allTimeBtn = document.createElement('button');
    allTimeBtn.className = 'archive-year';
    allTimeBtn.textContent = 'All time';
    allTimeBtn.addEventListener('click', () => {
        resetToAllPostsView();
    });
    tree.appendChild(allTimeBtn);

    years.forEach(year => {
        const yearRow = document.createElement('button');
        yearRow.className = 'archive-year';
        yearRow.textContent = year;

        const monthWrap = document.createElement('div');
        monthWrap.className = 'archive-months';

        const months = Array.from(map.get(year).entries());
        months.sort((a, b) => {
            const aDate = new Date(`${a[0]} 1, 2020`);
            const bDate = new Date(`${b[0]} 1, 2020`);
            return bDate - aDate;
        });

        yearRow.addEventListener('click', () => {
            monthWrap.classList.toggle('open');
            selectedYear = selectedYear === year ? null : year;
            selectedMonth = null;
            applyFilters();
        });

        months.forEach(([month, count]) => {
            const monthBtn = document.createElement('button');
            monthBtn.className = 'archive-month';
            monthBtn.textContent = `${month} (${count})`;
            monthBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                selectedYear = year;
                selectedMonth = month;
                applyFilters();
            });
            monthWrap.appendChild(monthBtn);
        });

        tree.appendChild(yearRow);
        tree.appendChild(monthWrap);
    });
}

function resetToAllPostsView() {
    selectedYear = null;
    selectedMonth = null;
    selectedTag = null;

    // Ensure default list returns to descending date order.
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const tagFilterSelect = document.getElementById('tagFilterSelect');
    if (tagFilterSelect) {
        tagFilterSelect.value = '';
    }

    clearAllCategories();
    updateCategoryDropdownLabel();

    document.querySelectorAll('.archive-months.open').forEach(monthGroup => {
        monthGroup.classList.remove('open');
    });

    applyFilters();
}

function renderTagFilters() {
    const select = document.getElementById('tagFilterSelect');
    const tagSet = new Set();

    allPosts.forEach(post => {
        post.tags.forEach(tag => tagSet.add(tag));
    });

    const tags = Array.from(tagSet).sort();

    select.innerHTML = '<option value="">All tags</option>';

    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = `#${tag}`;
        select.appendChild(option);
    });

    select.addEventListener('change', () => {
        selectedTag = select.value || null;
        applyFilters();
    });
}

function getPostCategories(post) {
    if (!Array.isArray(post.categories)) {
        return [];
    }

    return post.categories.filter(Boolean).map(category => String(category).trim()).filter(Boolean);
}

function getPostAssetMask(post) {
    const hasLinks =
        (Array.isArray(post.externalLinks) && post.externalLinks.some(link => link && typeof link.url === 'string' && link.url.trim() !== '')) ||
        (typeof post.linkedinPostUrl === 'string' && post.linkedinPostUrl.trim() !== '');
    const hasPictures = Array.isArray(post.images) && post.images.some(src => typeof src === 'string' && src.trim() !== '');

    return `${hasLinks ? '1' : '0'}${hasPictures ? '1' : '0'}`;
}

function renderCategoryFilters() {
    const menu = document.getElementById('categoryDropdownMenu');
    const categorySet = new Set();

    allPosts.forEach(post => {
        getPostCategories(post).forEach(category => categorySet.add(category));
    });

    const categories = Array.from(categorySet).sort((a, b) => a.localeCompare(b));

    menu.innerHTML = categories
        .map(category => `
            <label class="category-option" role="option" aria-selected="false">
                <input type="checkbox" name="blogCategoryFilter" value="${category}">
                <span>${category}</span>
            </label>
        `)
        .join('');

    selectedCategories = [];
    updateCategoryDropdownLabel();

    menu.addEventListener('change', (event) => {
        if (event.target && event.target.name === 'blogCategoryFilter') {
            selectedCategories = getSelectedCategoriesFromUi();
            updateCategoryDropdownLabel();
            applyFilters();
        }
    });

    if (!categoryDropdownInitialized) {
        setupCategoryDropdown();
        categoryDropdownInitialized = true;
    }
}

function setupCategoryDropdown() {
    const dropdown = document.getElementById('categoryDropdown');
    const button = document.getElementById('categoryDropdownBtn');
    const menu = document.getElementById('categoryDropdownMenu');

    button.addEventListener('click', () => {
        const isHidden = menu.classList.toggle('hidden');
        button.setAttribute('aria-expanded', String(!isHidden));
    });

    document.addEventListener('click', (event) => {
        if (!dropdown.contains(event.target)) {
            menu.classList.add('hidden');
            button.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            menu.classList.add('hidden');
            button.setAttribute('aria-expanded', 'false');
        }
    });
}

function getSelectedCategoriesFromUi() {
    return Array.from(document.querySelectorAll('input[name="blogCategoryFilter"]:checked')).map(input => input.value);
}

function clearAllCategories() {
    const checkboxes = document.querySelectorAll('input[name="blogCategoryFilter"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    selectedCategories = [];
}

function updateCategoryDropdownLabel() {
    const button = document.getElementById('categoryDropdownBtn');
    if (!button) {
        return;
    }

    const totalCategories = document.querySelectorAll('input[name="blogCategoryFilter"]').length;
    const selectedCount = selectedCategories.length;

    if (totalCategories === 0 || selectedCount === totalCategories) {
        button.textContent = 'All categories';
        return;
    }

    if (selectedCount === 0) {
        button.textContent = 'Select categories';
        return;
    }

    if (selectedCount === 1) {
        button.textContent = selectedCategories[0];
        return;
    }

    button.textContent = `${selectedCount} categories`;
}

function applyFilters() {
    filteredPosts = allPosts.filter(post => {
        const date = new Date(post.date);
        const year = String(date.getFullYear());
        const month = date.toLocaleString('default', { month: 'long' });
        const categories = getPostCategories(post);

        const tagMatch = !selectedTag || post.tags.includes(selectedTag);
        const categoryMatch = selectedCategories.length === 0 || categories.some(category => selectedCategories.includes(category));
        const yearMatch = !selectedYear || year === selectedYear;
        const monthMatch = !selectedMonth || month === selectedMonth;

        return tagMatch && categoryMatch && yearMatch && monthMatch;
    });

    // Keep list ordering fixed to newest-first.
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    renderBlogCards();
}

function renderBlogCards() {
    const container = document.getElementById('blogCards');

    if (filteredPosts.length === 0) {
        container.innerHTML = '<div class="blog-empty">No posts match this filter.</div>';
        return;
    }

    container.innerHTML = filteredPosts.map(post => {
        const tagHtml = post.tags.map(tag => `<span class="blog-tag">#${tag}</span>`).join('');
        const categories = getPostCategories(post);
        const categoryMetaHtml = categories.length > 0
            ? ` · <span class="blog-meta-categories colour-1">${categories.map(category => `<span class="blog-category">${category}</span>`).join('')}</span>`
            : '';
        const date = formatDate(post.date);

        return `
            <article class="blog-card" data-id="${post.id}">
                <div class="blog-card-meta">${date} · ${post.author}${categoryMetaHtml}</div>
                <div class="blog-title-row">
                    <h3 class="blog-card-title">${post.title}</h3>
                </div>
                <div class="blog-taxonomy">
                    <div class="blog-tags">${tagHtml}</div>
                </div>
                <hr>
                <p class="blog-card-summary">${post.summary}</p>
            </article>
        `;
    }).join('');

    container.querySelectorAll('.blog-card').forEach(card => {
        card.addEventListener('click', () => {
            const post = allPosts.find(p => p.id === card.dataset.id);
            if (post) {
                openFocusOverlay(post);
            }
        });
    });
}

function openFocusOverlay(post) {
    const overlay = document.getElementById('blogFocusOverlay');
    const focusMeta = document.getElementById('focusMeta');
    const focusTitleRow = document.getElementById('focusTitleRow');
    const focusContent = document.getElementById('focusContent');
    const focusLinks = document.getElementById('focusLinks');
    const galleryBtn = document.getElementById('focusGalleryBtn');

    const categories = getPostCategories(post);
    const categoryMetaHtml = categories.length > 0
        ? ` · <span class="blog-meta-categories">${categories.map(category => `<span class="blog-category">${category}</span>`).join('')}</span>`
        : '';
    focusMeta.innerHTML = `${formatDate(post.date)} · ${post.author}${categoryMetaHtml}`;
    focusTitleRow.innerHTML = `
        <h2 class="blog-card-title">${post.title}</h2>
        <div class="blog-taxonomy">
            <div class="blog-tags">${post.tags.map(tag => `<span class="blog-tag">#${tag}</span>`).join('')}</div>
        </div>
    `;

    focusContent.innerHTML = post.content.map(paragraph => `<p>${paragraph}</p>`).join('');
    appendCategoryCanvas(focusContent, categories);

    const links = [
        ...(Array.isArray(post.externalLinks) ? post.externalLinks.filter(link => link && typeof link.url === 'string' && link.url.trim() !== '') : [])
    ];
    if (typeof post.linkedinPostUrl === 'string' && post.linkedinPostUrl.trim() !== '') {
        links.push({ title: 'LinkedIn Post', url: post.linkedinPostUrl });
    }

    const assetMask = getPostAssetMask(post);
    const hasLinks = assetMask[0] === '1';
    const hasPictures = assetMask[1] === '1';

    if (hasLinks && links.length > 0) {
        focusLinks.innerHTML = links.map(link => `
            <a class="blog-link-thumb" href="${link.url}" target="_blank" rel="noopener noreferrer" title="${link.title}">
                <span>🔗</span>
                <small>${link.title}</small>
            </a>
        `).join('');
        focusLinks.style.display = 'flex';
    } else {
        focusLinks.innerHTML = '';
        focusLinks.style.display = 'none';
    }

    galleryBtn.style.display = hasPictures ? 'inline-flex' : 'none';

    galleryBtn.onclick = () => openGalleryOverlay(post.images || []);

    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeFocusOverlay() {
    stopPostCanvasAnimation();
    document.getElementById('blogFocusOverlay').classList.add('hidden');
    closeGalleryOverlay();
    closeImageViewer();
    document.body.style.overflow = 'auto';
}

function appendCategoryCanvas(container, categories) {
    stopPostCanvasAnimation();

    const canvasType = resolveCanvasTypeByCategoryPriority(categories);
    const canvasWrap = document.createElement('div');
    canvasWrap.className = 'post-category-canvas-wrap';

    const canvas = document.createElement('canvas');
    canvas.className = 'post-category-canvas';
    canvas.width = 900;
    canvas.height = 260;

    canvasWrap.appendChild(canvas);
    container.appendChild(canvasWrap);

    runCanvasScene(canvas, canvasType);
}

function resolveCanvasTypeByCategoryPriority(categories) {
    const normalized = (Array.isArray(categories) ? categories : [])
        .map(category => String(category).toLowerCase().trim());

    const hasCategory = (needle) => normalized.some(category => category.includes(needle));

    if (hasCategory('research')) {
        return 'research';
    }

    if (hasCategory('linkedin')) {
        return 'linkedin';
    }

    if (hasCategory('professional')) {
        return 'professional';
    }

    if (hasCategory('casual')) {
        return 'casual';
    }

    if (hasCategory('personal project')) {
        return 'personal-project';
    }

    return 'other';
}

function stopPostCanvasAnimation() {
    if (postCanvasAnimationFrame !== null) {
        cancelAnimationFrame(postCanvasAnimationFrame);
        postCanvasAnimationFrame = null;
    }
}

function runCanvasScene(canvas, sceneType) {
    const context = canvas.getContext('2d');
    if (!context) {
        return;
    }

    const drawFrame = (timeMs) => {
        const time = timeMs * 0.001;
        const width = canvas.width;
        const height = canvas.height;

        context.clearRect(0, 0, width, height);

        if (sceneType === 'research') {
            drawFlippingBookScene(context, width, height, time);
        } else if (sceneType === 'linkedin' || sceneType === 'professional') {
            drawRotatingWorldScene(context, width, height, time);
        } else if (sceneType === 'casual') {
            drawDinoRunningCircleScene(context, width, height, time);
        } else if (sceneType === 'personal-project') {
            drawSunriseSunsetScene(context, width, height, time);
        } else {
            drawFlockOfBirdsScene(context, width, height, time);
        }

        postCanvasAnimationFrame = requestAnimationFrame(drawFrame);
    };

    postCanvasAnimationFrame = requestAnimationFrame(drawFrame);
}

function drawCanvasBackground(context, width, height, topColor, bottomColor) {
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, topColor);
    gradient.addColorStop(1, bottomColor);
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
}

function drawDinoRunningCircleScene(context, width, height, time) {
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#eef7f0');
    gradient.addColorStop(1, '#dceadf');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    if (!context.canvas.__dinoState) {
        const grassPatches = [];
        for (let i = 0; i < 15; i++) {
            grassPatches.push({
                x: width * 0.2 + Math.random() * width * 0.6,
                y: height * 0.3 + Math.random() * height * 0.5,
                scale: 0.5 + Math.random() * 0.5
            });
        }
        context.canvas.__dinoState = {
            grass: grassPatches,
            footprints: [],
            lastStepTime: 0,
            stepCount: 0
        };
    }

    const state = context.canvas.__dinoState;
    const centerX = width * 0.5;
    const centerY = height * 0.56;
    const radiusX = width * 0.3;
    const radiusY = height * 0.22;

    context.strokeStyle = 'rgba(83, 140, 100, 0.4)';
    context.lineWidth = 2;
    state.grass.forEach(patch => {
        context.save();
        context.translate(patch.x, patch.y);
        context.scale(patch.scale, patch.scale);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(-4, -8);
        context.moveTo(0, 0);
        context.lineTo(2, -10);
        context.moveTo(0, 0);
        context.lineTo(6, -6);
        context.stroke();
        context.restore();
    });

    const speed = 1.8;
    const angle = time * speed;
    const x = centerX + Math.cos(angle) * radiusX;
    const y = centerY + Math.sin(angle) * radiusY;
    
    const isMovingRight = Math.sin(angle) < 0;

    const stepInterval = 0.12; 
    if (time - state.lastStepTime > stepInterval) {
        state.footprints.push({
            x: x,
            y: y,
            time: time,
            isMovingRight: isMovingRight,
            offsetStep: state.stepCount % 2 === 0
        });
        state.lastStepTime = time;
        state.stepCount++;
    }

    const fadeDuration = 2.0;
    state.footprints = state.footprints.filter(fp => time - fp.time < fadeDuration);

    state.footprints.forEach(fp => {
        const age = time - fp.time;
        const alpha = Math.max(0, 1 - (age / fadeDuration));
        
        context.fillStyle = `rgba(83, 83, 83, ${alpha * 0.4})`;
        context.save();
        context.translate(fp.x, fp.y + 12); 
        
        const yOffset = fp.offsetStep ? -3 : 3; 
        context.beginPath();
        context.ellipse(0, yOffset, 4, 2, 0, 0, Math.PI * 2);
        context.fill();
        context.restore();
    });

    context.save();
    context.translate(x, y);
    
    const scaleX = isMovingRight ? 1 : -1;
    context.scale(scaleX, 1);

    const bounce = Math.abs(Math.sin(time * speed * 4)) * 3;
    context.translate(0, -bounce);

    context.fillStyle = '#535353'; 

    context.fillRect(-10, -10, 14, 16); 
    context.fillRect(-14, -6, 4, 8);    
    context.fillRect(-18, -10, 4, 6);   

    context.fillRect(4, -22, 14, 10);   
    context.fillRect(18, -20, 4, 6);    
    context.fillRect(4, -12, 6, 2);     
    
    context.fillRect(6, -4, 6, 2);
    context.fillRect(10, -2, 2, 2);

    context.fillStyle = '#eef7f0'; 
    context.fillRect(6, -20, 2, 2);

    context.fillStyle = '#535353';
    const runCycle = (time * speed * 4) % 1; 

    if (runCycle < 0.5) {
        context.fillRect(-4, 6, 4, 6);  
        context.fillRect(-2, 12, 4, 2); 
        
        context.fillRect(4, 4, 4, 4);   
        context.fillRect(6, 8, 4, 2);   
    } else {
        context.fillRect(-4, 4, 4, 4);  
        context.fillRect(-2, 8, 4, 2);  
        
        context.fillRect(4, 6, 4, 6);   
        context.fillRect(6, 12, 4, 2);  
    }

    context.restore();
}

function drawRotatingWorldScene(context, width, height, time) {
    // 1. Draw Deep Space Background
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0b1320');
    gradient.addColorStop(1, '#1a1f35');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    // 2. Initialize and draw glittering stars
    if (!context.canvas.__worldState) {
        const stars = [];
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.5 + 0.5,
                phase: Math.random() * Math.PI * 2,
                speed: Math.random() * 1.5 + 0.5
            });
        }
        context.canvas.__worldState = { stars };
    }

    context.fillStyle = '#ffffff';
    context.canvas.__worldState.stars.forEach(star => {
        const alpha = (Math.sin(time * star.speed + star.phase) + 1) * 0.5;
        context.globalAlpha = alpha * 0.8;
        context.beginPath();
        context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        context.fill();
    });
    context.globalAlpha = 1.0;

    const centerX = width * 0.5;
    const centerY = height * 0.52;
    const globeRadius = Math.min(width, height) * 0.23;

    // 3. Calculate Satellite Orbit Data
    const orbitSpeed = 1.2;
    const orbitAngle = time * orbitSpeed;
    const satX = centerX + Math.cos(orbitAngle) * (globeRadius * 1.8);
    const satY = centerY + Math.sin(orbitAngle) * (globeRadius * 0.4);
    
    // Z-Depth Check: True if satellite is in the back half of the orbit
    const isBehind = Math.sin(orbitAngle) < 0;

    const drawSatellite = () => {
        context.save();
        context.translate(satX, satY);
        context.rotate(Math.cos(orbitAngle) * 0.2);

        // Solar panels
        context.fillStyle = '#4a90e2';
        context.fillRect(-14, -5, 10, 10);
        context.fillRect(4, -5, 10, 10);
        
        // Panel connection rod
        context.fillStyle = '#7a8c9e';
        context.fillRect(-4, -1, 8, 2);

        // Main body
        context.fillStyle = '#e0e0e0';
        context.beginPath();
        context.arc(0, 0, 5, 0, Math.PI * 2);
        context.fill();

        // Blinking red beacon
        const blink = Math.floor(time * 4) % 2 === 0 ? 1 : 0.3;
        context.fillStyle = `rgba(255, 50, 50, ${blink})`;
        context.beginPath();
        context.arc(0, -3, 1.5, 0, Math.PI * 2);
        context.fill();

        context.restore();
    };

    const drawMoon = () => {
        // Base Moon Color
        context.fillStyle = '#d4d9de';
        context.beginPath();
        context.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
        context.fill();

        // Clip rotation layer to the moon's surface
        context.save();
        context.beginPath();
        context.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
        context.clip();

        // Rotate the surface features to simulate a spinning moon
        context.translate(centerX, centerY);
        context.rotate(time * 0.15); 

        // Draw Lunar Maria (Dark flat plains)
        context.fillStyle = '#a3acb5';
        context.beginPath(); 
        context.ellipse(-globeRadius * 0.3, -globeRadius * 0.2, globeRadius * 0.4, globeRadius * 0.3, 0.5, 0, Math.PI * 2); 
        context.fill();
        context.beginPath(); 
        context.ellipse(globeRadius * 0.2, -globeRadius * 0.4, globeRadius * 0.35, globeRadius * 0.25, -0.3, 0, Math.PI * 2); 
        context.fill();
        context.beginPath(); 
        context.ellipse(globeRadius * 0.3, globeRadius * 0.2, globeRadius * 0.25, globeRadius * 0.3, 0.8, 0, Math.PI * 2); 
        context.fill();

        // Helper to draw structured craters with subtle 3D rim highlights
        const drawCrater = (x, y, r) => {
            context.fillStyle = '#8c959e';
            context.beginPath(); 
            context.arc(x, y, r, 0, Math.PI * 2); 
            context.fill();
            
            context.strokeStyle = '#e6e9ec';
            context.lineWidth = r * 0.15;
            context.lineCap = 'round';
            context.beginPath(); 
            context.arc(x - r * 0.1, y - r * 0.1, r * 0.9, Math.PI * 0.7, Math.PI * 1.7); 
            context.stroke();
        };
        
        // Scatter craters across the surface
        drawCrater(-globeRadius * 0.1, globeRadius * 0.4, globeRadius * 0.12);
        drawCrater(globeRadius * 0.5, -globeRadius * 0.1, globeRadius * 0.08);
        drawCrater(-globeRadius * 0.5, -globeRadius * 0.05, globeRadius * 0.06);
        drawCrater(globeRadius * 0.1, globeRadius * 0.6, globeRadius * 0.05);
        drawCrater(-globeRadius * 0.2, -globeRadius * 0.6, globeRadius * 0.09);

        context.restore();

        // 3D Sphere Inner Shadow (gives the moon volume and depth independent of rotation)
        const shadowGlow = context.createRadialGradient(
            centerX - globeRadius * 0.3, centerY - globeRadius * 0.3, globeRadius * 0.1,
            centerX, centerY, globeRadius
        );
        shadowGlow.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        shadowGlow.addColorStop(0.7, 'rgba(0, 0, 0, 0.2)');
        shadowGlow.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
        context.fillStyle = shadowGlow;
        context.beginPath(); 
        context.arc(centerX, centerY, globeRadius, 0, Math.PI * 2); 
        context.fill();

        // Subtle outer glow/halo for moonlight scatter
        const moonHalo = context.createRadialGradient(
            centerX, centerY, globeRadius * 0.98, 
            centerX, centerY, globeRadius * 1.15
        );
        moonHalo.addColorStop(0, 'rgba(212, 217, 222, 0.4)');
        moonHalo.addColorStop(1, 'rgba(212, 217, 222, 0)');
        context.fillStyle = moonHalo;
        context.beginPath(); 
        context.arc(centerX, centerY, globeRadius * 1.15, 0, Math.PI * 2); 
        context.fill();
    };

    // 4. Render in the correct Z-index order based on orbit phase
    if (isBehind) {
        drawSatellite();
        drawMoon();
    } else {
        drawMoon();
        drawSatellite();
    }
}

function drawFlippingBookScene(context, width, height, time) {
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#fff6e6');
    gradient.addColorStop(1, '#f6ead0');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.58;
    const bookWidth = width * 0.6; 
    const bookHeight = height * 0.45;
    const pageWidth = bookWidth * 0.5;

    // Draw Book Cover
    context.fillStyle = '#7d5738';
    context.fillRect(centerX - pageWidth - 6, centerY - bookHeight * 0.5 - 6, bookWidth + 12, bookHeight + 12);

    // Draw Base Pages (always static, the left one holds text until covered, the right one is always blank underneath)
    context.fillStyle = '#fdf7ed';
    context.fillRect(centerX - pageWidth, centerY - bookHeight * 0.5, pageWidth, bookHeight);
    context.fillRect(centerX, centerY - bookHeight * 0.5, pageWidth, bookHeight);

    // Timeline Configuration (4-second total loop)
    const cycleLength = 4.0;
    const t = time % cycleLength;
    let leftProgress = 0;
    let rightProgress = 0;
    let flipAngle = 0;

    // Phase 1: Write on Left Page (0s to 1.5s)
    if (t < 1.5) {
        leftProgress = t / 1.5;
        rightProgress = 0;
        flipAngle = 0;
    } 
    // Phase 2: Write on Right Page (1.5s to 3.0s)
    else if (t < 3.0) {
        leftProgress = 1.0;
        rightProgress = (t - 1.5) / 1.5;
        flipAngle = 0;
    } 
    // Phase 3: Flip Page to reveal next blank pages (3.0s to 4.0s)
    else {
        leftProgress = 1.0;
        rightProgress = 1.0;
        const flipPhase = t - 3.0; 
        const ease = 0.5 - 0.5 * Math.cos(flipPhase * Math.PI); 
        flipAngle = ease * Math.PI;
    }

    // Helper to draw squiggles
    const drawSquiggles = (startX, isLocal, progress) => {
        if (progress <= 0) return;
        
        context.strokeStyle = '#b09b85';
        context.lineWidth = 2.5;
        context.lineCap = 'round';
        context.lineJoin = 'round';

        const lineYOffsets = [-0.3, -0.1, 0.1, 0.3];
        const maxLen = pageWidth * 0.8;
        
        // If drawing on the base left page, use absolute coordinates. If on the flipping page, use local.
        const textStartX = isLocal ? pageWidth * 0.1 : startX - pageWidth * 0.9;
        const baseCenterY = isLocal ? 0 : centerY;

        lineYOffsets.forEach((yOff, index) => {
            const lineStartProg = index * 0.25;
            const lineEndProg = (index + 1) * 0.25;
            
            let lineProg = 0;
            if (progress >= lineEndProg) lineProg = 1;
            else if (progress > lineStartProg) lineProg = (progress - lineStartProg) / 0.25;
            
            if (lineProg > 0) {
                context.beginPath();
                context.moveTo(textStartX, baseCenterY + bookHeight * yOff);
                const drawLen = maxLen * lineProg;
                for (let x = 0; x <= drawLen; x += 2) {
                    const y = baseCenterY + bookHeight * yOff + Math.sin(x * 0.3) * 2.5 + Math.cos(x * 0.15) * 1.5;
                    context.lineTo(textStartX + x, y);
                }
                context.stroke();
            }
        });
    };

    // 1. Draw left text onto the static base left page
    drawSquiggles(centerX, false, leftProgress);

    // Draw center spine
    context.strokeStyle = '#c3a37d';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(centerX, centerY - bookHeight * 0.5);
    context.lineTo(centerX, centerY + bookHeight * 0.5);
    context.stroke();

    // 2. Draw the Flipping Page (Acts as the right page when resting)
    if (flipAngle < Math.PI) {
        context.save();
        context.translate(centerX, centerY);
        
        const flipScaleX = Math.cos(flipAngle);
        context.scale(flipScaleX, 1);
        
        // Draw the page itself
        context.fillStyle = '#fdf7ed';
        context.fillRect(0, -bookHeight * 0.5, pageWidth, bookHeight);
        
        // If we are looking at the front of the flipping page, draw the right-side text
        if (flipScaleX > 0) {
            drawSquiggles(0, true, rightProgress);
        }
        // When flipScaleX < 0, we see the back of the flipping page, which remains blank

        // Dynamic shadow during the flip
        const shadowAlpha = Math.abs(Math.sin(flipAngle)) * 0.15;
        context.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
        context.fillRect(0, -bookHeight * 0.5, pageWidth, bookHeight);

        // Flipping page spine crease
        context.strokeStyle = 'rgba(0,0,0,0.1)';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(0, -bookHeight * 0.5);
        context.lineTo(0, bookHeight * 0.5);
        context.stroke();
        
        context.restore();
    }
}

function drawSunriseSunsetScene(context, width, height, time) {
    // 1. Buffer Setup
    let buffer = context.canvas.__bufferCanvas;
    if (!buffer || buffer.width !== width || buffer.height !== height) {
        buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;
        context.canvas.__bufferCanvas = buffer;
    }
    const ctx = buffer.getContext('2d');

    // 2. BACK LAYER: Sky Gradient
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#4a0000'); 
    sky.addColorStop(0.4, '#aa2200');
    sky.addColorStop(0.7, '#ff4400');
    sky.addColorStop(1, '#ffaa00');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    const horizonY = height * 0.75;
    const sunX = width * 0.5;
    const sunRadius = Math.min(width, height) * 0.24;
    const sunY = horizonY - sunRadius;

    // 3. MIDDLE LAYER: Sun and Haze (Behind the ground)
    const glow = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.8, sunX, sunY, sunRadius * 1.5);
    glow.addColorStop(0, 'rgba(255, 34, 0, 1)');
    glow.addColorStop(1, 'rgba(255, 34, 0, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius * 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff2200';
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    // 4. FRONT LAYER: Ground (Covers the bottom of the sun)
    ctx.fillStyle = '#000000';
    ctx.fillRect(-width * 0.2, horizonY, width * 1.4, height - horizonY);

    // 5. Birds (Flying in front of sky/sun)
    const birdIntervals = [22, 31, 47];
    const birdVisibleSeconds = 11;
    ctx.strokeStyle = 'rgba(24, 12, 12, 0.92)';
    ctx.lineCap = 'round';
    birdIntervals.forEach((interval, index) => {
        const phase = (time + index * 4.7) % interval;
        const speedFactors = [0.95, 1.08, 0.92];
        speedFactors.forEach((speedFactor, pairIndex) => {
            const span = width * (0.014 + index * 0.003) * (pairIndex === 0 ? 0.98 : 1.05);
            const runSeconds = birdVisibleSeconds / speedFactor;

            // Keep each bird active until it has enough time to travel fully off-screen.
            if (phase > runSeconds) {
                return;
            }

            const progress = phase / runSeconds;
            const entryMargin = 26 + span * 1.4;
            const exitMargin = 52 + span * 1.6;
            const birdX = -entryMargin + (width + entryMargin + exitMargin) * progress;

            // Do not de-render until the full bird silhouette is outside the viewport.
            if (birdX + span < -2 || birdX - span > width + 2) {
                return;
            }

            const birdY =
                horizonY - height * (0.26 + index * 0.055) +
                Math.sin(time * 1.1 + index + pairIndex * 0.55) * 5 +
                (pairIndex === 0 ? -height * 0.013 : height * 0.011);

            // 2:1:2 horizontal fade mask: center is 90% faded (alpha 0.1).
            const centerStart = width * 0.4;
            const centerEnd = width * 0.6;
            const transition = width * 0.03;
            const minOccludedAlpha = 0.1;
            let birdAlpha = 1;

            if (birdX >= centerStart && birdX <= centerEnd) {
                birdAlpha = minOccludedAlpha;
            } else if (birdX < centerStart) {
                const t = (centerStart - birdX) / transition;
                const eased = Math.min(1, Math.max(0, t));
                birdAlpha = minOccludedAlpha + (1 - minOccludedAlpha) * eased;
            } else {
                const t = (birdX - centerEnd) / transition;
                const eased = Math.min(1, Math.max(0, t));
                birdAlpha = minOccludedAlpha + (1 - minOccludedAlpha) * eased;
            }

            if (birdAlpha <= 0.02) {
                return;
            }

            const flap = Math.sin(time * (9 + pairIndex * 0.6) + index * 1.7 + pairIndex * 1.1);

            ctx.save();
            ctx.globalAlpha = birdAlpha;
            ctx.lineWidth = 1.8 + index * 0.4;
            ctx.beginPath();
            ctx.moveTo(birdX - span, birdY - flap * span * 0.36);
            ctx.quadraticCurveTo(birdX - span * 0.35, birdY - flap * span * 0.1, birdX, birdY);
            ctx.quadraticCurveTo(birdX + span * 0.35, birdY - flap * span * 0.1, birdX + span, birdY - flap * span * 0.36);
            ctx.stroke();

            ctx.fillStyle = 'rgba(24, 12, 12, 0.92)';
            ctx.beginPath();
            ctx.ellipse(birdX, birdY, span * 0.28, span * 0.1, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    });

    // 6. Grass and Trees (In front of ground/sun)
    if (!ctx.canvas.__sunsetGrassState || ctx.canvas.__sunsetGrassState.width !== width) {
        const blades = [];
        for (let i = 0; i < 1500; i++) {
            blades.push({
                x: Math.random() * width,
                baseHeight: height * (0.02 + Math.random() * 0.06),
                thickness: Math.random() * 2 + 1,
                stiffness: Math.random() * 0.4 + 0.6,
                phase: Math.random() * Math.PI * 2
            });
        }
        ctx.canvas.__sunsetGrassState = { blades, width };
    }

    const grassState = ctx.canvas.__sunsetGrassState;
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#000000';
    grassState.blades.forEach(blade => {
        const localWind = Math.sin(time * 2 + blade.phase) * 0.1;
        const sway = localWind * blade.baseHeight;
        ctx.lineWidth = blade.thickness;
        ctx.beginPath();
        ctx.moveTo(blade.x, horizonY);
        ctx.quadraticCurveTo(blade.x + sway * 0.5, horizonY - blade.baseHeight * 0.5, blade.x + sway, horizonY - blade.baseHeight);
        ctx.stroke();
    });

    // Black rock farther to the canvas side.
    const rockX = width * 0.065;
    const rockY = horizonY - height * 0.008;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(rockX, rockY, width * 0.022, height * 0.016, -0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(width * 0.8, horizonY);
    // Static foreground silhouette; no lateral wobble.
    
    // ctx.fillStyle = '#000000';
    
    ctx.beginPath();
    ctx.moveTo(-width * 0.015, 0);
    ctx.quadraticCurveTo(-width * 0.01, -height * 0.5, -width * 0.03, -height * 0.32);
    ctx.lineTo(-width * 0.01, -height * 0.3);
    ctx.lineTo(width * 0.01, -height * 0.35);
    ctx.quadraticCurveTo(width * 0.01, -height * 0.15, width * 0.025, 0);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(-width * 0.024, -height * 0.216, width * 0.08, height * 0.02, -0.21, 0, Math.PI * 2);
    // ctx.ellipse(width * 0.04, -height * 0.26, width * 0.8, height * 0.02, 0.1, 0.9, Math.PI * 2);
    ctx.ellipse(0, -height * 0.32, width * 0.07, height * 0.026, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 7. Heat Shimmer / Final Render
    context.clearRect(0, 0, width, height);
    const sliceHeight = 2;
    const layers = 3;

    for (let y = 0; y < height; y += sliceHeight) {
        const distY = Math.abs(y - sunY);
        const proximity = Math.max(0, 1 - (distY / (sunRadius * 100)));

        if (proximity === 0) {
            context.globalAlpha = 1.0;
            context.drawImage(buffer, 0, y, width, sliceHeight, 0, y, width, sliceHeight);
            continue;
        }

        for (let i = 0; i < layers; i++) {
            context.globalAlpha = (i === 0) ? 1.0 : 0.3;
            const phase = i * 1.2;
            
            const wave = Math.sin(time * 1.25 + y * 0.045 + phase) +
                         Math.cos(time * 0.9 + y * 0.028 - phase) * 0.45;
            
            const shiftX = wave * proximity * (width * 0.0038);
            
            context.drawImage(
                buffer,
                0, y, width, sliceHeight,
                shiftX, y, width, sliceHeight
            );

            // Wrap one extra copy to cover the exposed strip when shifted.
            const wrapX = shiftX > 0 ? shiftX - width : shiftX + width;
            context.drawImage(
                buffer,
                0, y, width, sliceHeight,
                wrapX, y, width, sliceHeight
            );
        }
    }
    context.globalAlpha = 1.0;
}


function drawFlockOfBirdsScene(context, width, height, time) {
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1f4f9b');
    gradient.addColorStop(0.35, '#4f86cf');
    gradient.addColorStop(0.7, '#86b8e8');
    gradient.addColorStop(1, '#b9ddff');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    if (!context.canvas.__birdState) {
        const birds = [];
        const clouds = [
            {
                x: width * 0.2,
                y: height * 0.78,
                width: width * 0.58,
                height: height * 0.34,
                phaseOffset: Math.random() * Math.PI * 2
            },
            {
                x: width * 0.5,
                y: height * 0.83,
                width: width * 0.72,
                height: height * 0.4,
                phaseOffset: Math.random() * Math.PI * 2
            },
            {
                x: width * 0.82,
                y: height * 0.79,
                width: width * 0.56,
                height: height * 0.33,
                phaseOffset: Math.random() * Math.PI * 2
            }
        ];
        for (let i = 0; i < 20; i++) {
            birds.push({
                x: Math.random() * width,
                y: height * 0.15 + Math.random() * height * 0.4,
                size: (Math.random() * 3 + 5) * 1.2,
                speed: Math.random() * 1.5 + 1.0,
                direction: Math.random() > 0.5 ? 1 : -1,
                phaseOffset: Math.random() * Math.PI * 2
            });
        }
        context.canvas.__birdState = { birds, clouds };
    }

    const state = context.canvas.__birdState;

    context.strokeStyle = '#333333';
    context.fillStyle = '#333333';
    context.lineCap = 'round';

    state.birds.forEach(bird => {
        bird.x += bird.speed * 0.9 * bird.direction;

        if (bird.x > width + 30) {
            bird.direction = -1;
        } else if (bird.x < -30) {
            bird.direction = 1;
        }

        const bobbing = Math.sin(time * 2.5 + bird.phaseOffset) * 12;
        const currentY = bird.y + bobbing;
        
        const flap = Math.sin(time * 10 + bird.phaseOffset);
        
        context.save();
        context.translate(bird.x, currentY);
        
        if (bird.direction === -1) {
            context.scale(-1, 1);
        }

        context.lineWidth = bird.size * .4;

        context.beginPath();
        context.moveTo(-bird.size, -flap * bird.size);
        context.quadraticCurveTo(-bird.size * 0.3, -flap * bird.size * 0.2, 0, 0);
        context.quadraticCurveTo(bird.size * 0.3, -flap * bird.size * 0.2, bird.size, -flap * bird.size);
        context.stroke();

        context.beginPath();
        context.ellipse(0, 0, bird.size * 0.8, bird.size * 0.25, 0, 0, Math.PI * 2);
        context.fill();

        context.restore();
    });

    // Three giant, fluffy bobbing clouds in the lower half, drawn after birds to occlude them.
    state.clouds.forEach(cloud => {
        const bob = Math.sin(time * 0.45 + cloud.phaseOffset) * (height * 0.012);
        const y = cloud.y + bob;

        // Soft underside mass.
        context.fillStyle = 'rgba(198, 204, 214, 0.74)';
        context.beginPath();
        context.ellipse(cloud.x, y + cloud.height * 0.07, cloud.width * 0.54, cloud.height * 0.54, 0, 0, Math.PI * 2);
        context.ellipse(cloud.x - cloud.width * 0.33, y + cloud.height * 0.03, cloud.width * 0.33, cloud.height * 0.4, 0, 0, Math.PI * 2);
        context.ellipse(cloud.x + cloud.width * 0.33, y + cloud.height * 0.02, cloud.width * 0.31, cloud.height * 0.38, 0, 0, Math.PI * 2);
        context.fill();

        // Main fluffy lobe cluster.
        context.fillStyle = 'rgba(217, 223, 232, 0.82)';
        context.beginPath();
        context.ellipse(cloud.x - cloud.width * 0.4, y - cloud.height * 0.08, cloud.width * 0.23, cloud.height * 0.32, 0, 0, Math.PI * 2);
        context.ellipse(cloud.x - cloud.width * 0.2, y - cloud.height * 0.2, cloud.width * 0.28, cloud.height * 0.4, 0, 0, Math.PI * 2);
        context.ellipse(cloud.x, y - cloud.height * 0.24, cloud.width * 0.3, cloud.height * 0.44, 0, 0, Math.PI * 2);
        context.ellipse(cloud.x + cloud.width * 0.22, y - cloud.height * 0.18, cloud.width * 0.27, cloud.height * 0.38, 0, 0, Math.PI * 2);
        context.ellipse(cloud.x + cloud.width * 0.4, y - cloud.height * 0.05, cloud.width * 0.22, cloud.height * 0.31, 0, 0, Math.PI * 2);
        context.fill();

        // Top highlight puffs for extra fluff texture.
        context.fillStyle = 'rgba(233, 237, 243, 0.88)';
        context.beginPath();
        context.ellipse(cloud.x - cloud.width * 0.08, y - cloud.height * 0.29, cloud.width * 0.13, cloud.height * 0.18, 0, 0, Math.PI * 2);
        context.ellipse(cloud.x + cloud.width * 0.12, y - cloud.height * 0.27, cloud.width * 0.12, cloud.height * 0.17, 0, 0, Math.PI * 2);
        context.ellipse(cloud.x - cloud.width * 0.28, y - cloud.height * 0.2, cloud.width * 0.1, cloud.height * 0.14, 0, 0, Math.PI * 2);
        context.fill();
    });

    // One red balloon fly-by every 5 minutes, first appearance only after initial 5 minutes.
    const balloonIntervalSeconds = 300;
    const balloonVisibleSeconds = 14;
    const balloonPhase = time % balloonIntervalSeconds;

    if (time >= balloonIntervalSeconds && balloonPhase <= balloonVisibleSeconds) {
        const progress = balloonPhase / balloonVisibleSeconds;
        const balloonX = -36 + (width + 72) * progress;
        const balloonY = height * 0.18 + Math.sin(time * 1.1) * 8;

        context.save();

        context.strokeStyle = 'rgba(120, 30, 30, 0.8)';
        context.lineWidth = 1.6;
        context.beginPath();
        context.moveTo(balloonX, balloonY + 14);
        context.quadraticCurveTo(balloonX - 6, balloonY + 30, balloonX + 1, balloonY + 42);
        context.stroke();

        context.fillStyle = '#d62222';
        context.beginPath();
        context.ellipse(balloonX, balloonY, 13, 17, 0, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = '#f37a7a';
        context.beginPath();
        context.ellipse(balloonX - 4, balloonY - 4, 3, 5, -0.4, 0, Math.PI * 2);
        context.fill();

        context.restore();
    }
}

function openGalleryOverlay(images) {
    const gallery = document.getElementById('galleryOverlay');
    const grid = document.getElementById('galleryGrid');

    currentImages = images;

    if (!images || images.length === 0) {
        grid.innerHTML = '<div class="blog-empty">No images attached to this post.</div>';
    } else {
        grid.innerHTML = images.map((src, index) => `
            <button class="gallery-tile" data-index="${index}">
                <img src="${src}" alt="Blog media ${index + 1}">
            </button>
        `).join('');

        grid.querySelectorAll('.gallery-tile').forEach(tile => {
            tile.addEventListener('click', () => {
                openImageViewer(Number(tile.dataset.index));
            });
        });
    }

    gallery.classList.remove('hidden');
}

function closeGalleryOverlay() {
    document.getElementById('galleryOverlay').classList.add('hidden');
}

function openImageViewer(index) {
    currentImageIndex = index;
    const viewer = document.getElementById('imageViewer');
    const img = document.getElementById('viewerImage');
    img.src = currentImages[currentImageIndex];
    viewer.classList.remove('hidden');
}

function closeImageViewer() {
    document.getElementById('imageViewer').classList.add('hidden');
}

function moveViewer(step) {
    if (!currentImages.length) {
        return;
    }

    currentImageIndex = (currentImageIndex + step + currentImages.length) % currentImages.length;
    document.getElementById('viewerImage').src = currentImages[currentImageIndex];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('default', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
