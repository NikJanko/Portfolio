// ============================================
// BLOG PAGE FUNCTIONALITY
// ============================================

let allPosts = [];
let filteredPosts = [];
let selectedTag = null;
let selectedYear = null;
let selectedMonth = null;
let currentImages = [];
let currentImageIndex = 0;

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

function applyFilters() {
    filteredPosts = allPosts.filter(post => {
        const date = new Date(post.date);
        const year = String(date.getFullYear());
        const month = date.toLocaleString('default', { month: 'long' });

        const tagMatch = !selectedTag || post.tags.includes(selectedTag);
        const yearMatch = !selectedYear || year === selectedYear;
        const monthMatch = !selectedMonth || month === selectedMonth;

        return tagMatch && yearMatch && monthMatch;
    });

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
        const date = formatDate(post.date);

        return `
            <article class="blog-card" data-id="${post.id}">
                <div class="blog-card-meta">${date} · ${post.author}</div>
                <div class="blog-title-row">
                    <h3 class="blog-card-title">${post.title}</h3>
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

    focusMeta.textContent = `${formatDate(post.date)} · ${post.author}`;
    focusTitleRow.innerHTML = `
        <h2 class="blog-card-title">${post.title}</h2>
        <div class="blog-tags">${post.tags.map(tag => `<span class="blog-tag">#${tag}</span>`).join('')}</div>
    `;

    focusContent.innerHTML = post.content.map(paragraph => `<p>${paragraph}</p>`).join('');

    const links = [...post.externalLinks];
    if (post.linkedinPostUrl) {
        links.push({ title: 'LinkedIn Post', url: post.linkedinPostUrl });
    }

    focusLinks.innerHTML = links.map(link => `
        <a class="blog-link-thumb" href="${link.url}" target="_blank" rel="noopener noreferrer" title="${link.title}">
            <span>🔗</span>
            <small>${link.title}</small>
        </a>
    `).join('');

    galleryBtn.onclick = () => openGalleryOverlay(post.images || []);

    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeFocusOverlay() {
    document.getElementById('blogFocusOverlay').classList.add('hidden');
    closeGalleryOverlay();
    closeImageViewer();
    document.body.style.overflow = 'auto';
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
