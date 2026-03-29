# Portfolio Website - Documentation

## Overview
A modern, fully responsive portfolio website with an interactive projects page featuring a timeline-based filtering system.

## File Structure
```
portfolio/
├── index.html          # Main portfolio page
├── projects.html       # Projects detail page with timeline
├── blog.html           # Blog page
├── styles.css          # All styling (responsive design)
├── content.json        # Portfolio content data (intro, education, awards, links, projects)
├── blog-data.json      # Blog posts data
├── main.js            # Main page interactions
├── projects.js        # Projects page logic
├── blog.js             # Blog page logic
├── scripts/
│   └── content-manager.js # CLI to add content entries
├── templates/
│   ├── new-project.json
│   ├── new-award.json
│   ├── new-education.json
│   └── new-blog-post.json
└── README.md          # This file
```

## JSON-First Content Model
All site content is now loaded from JSON files.

- Main pages read from `content.json`
- Blog reads from `blog-data.json`

The old `data.js` file can be kept as legacy reference, but it is no longer used by `index.html` or `projects.html`.

## Add Content via Script
You can add new entries without manual edits by using the content manager.

1. Copy a template from `templates/` and fill it in.
2. Run one of these commands:

```bash
node scripts/content-manager.js add project templates/new-project.json
node scripts/content-manager.js add award templates/new-award.json
node scripts/content-manager.js add education templates/new-education.json
node scripts/content-manager.js add blog templates/new-blog-post.json
```

Or use the shorter npm commands from `package.json`:

```bash
npm run add:project -- templates/new-project.json
npm run add:award -- templates/new-award.json
npm run add:education -- templates/new-education.json
npm run add:blog -- templates/new-blog-post.json
```

Create a fresh blog template with today's date:

```bash
npm run new:blog-template
```

Delete entries by id:

```bash
npm run delete:project -- 12
npm run delete:award -- 3
npm run delete:education -- 2
npm run delete:blog -- post-001
```

Notes:
- If `id` is omitted, the script auto-generates one.
- Blog posts are inserted at the top of `blog-data.json`.
- Requires Node.js installed locally.

## Features

### Main Page (index.html)
- **Introduction Section**: Face photo (33%) + Quick intro text (66%)
- **Education Section**: Institution photo (25%) + Education details (75%)
- **Awards Section**: Vertical list with thumbnail + award title + date
- **Projects Section**: Intro paragraph + links to Past/Current/Future projects
- **Links Section**: Social media links (LinkedIn, GitHub, WakaTime)
- Smooth scrolling navigation with sticky navbar

### Projects Page (projects.html)
#### Two View Modes:
1. **Timeline View (Enabled)**: 
   - Visual timeline bar: 🦖 Past | 🏙️ Current | 🚀 Future
   - Interactive slider to navigate between time periods
   - Cards update based on selected period
   
2. **Section View (Disabled)**:
   - Three section headers with appropriate projects underneath
   - Cleaner view for browsing all projects

#### Project Cards:
- 4 cards per row (responsive grid)
- Display: Image, status badge, title, description
- Clickable to expand into detail modal

#### Expanded Project Modal:
- Project image thumbnail
- Summary section
- Challenges section
- Tools & Technologies (tag-based display)
- Scrollable content
- Close button or click outside to dismiss

## Customization

### Adding/Editing Projects
Edit `content.json` and add to the `projects` array:

```javascript
{
    id: 13,                           // Unique ID
   type: 'present',                  // 'dead', 'past', 'present', or 'future'
    title: 'Your Project Title',      // Project name
    image: 'http://image-url.com',    // Project image URL
    summary: 'Brief description...',  // Short summary (shows in modal)
    challenges: 'What challenges...', // Challenge description
    tools: ['Tech1', 'Tech2', ...]    // Array of technologies
}
```

### Customizing Content
1. **Images**: Replace placeholder URLs with real images
2. **Social Links**: Update URLs in the Links section
3. **Education/Awards**: Modify the HTML directly in index.html
4. **Navigation**: Edit nav menu in navbar sections

### Styling
- **Color Scheme**: Located in `styles.css` (gradient: #667eea → #764ba2)
- **Fonts**: Using 'Segoe UI' as primary font
- **Responsive Breakpoints**: 768px (tablet) and 480px (mobile)

To change colors, search for `667eea` and `764ba2` in styles.css

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6 JavaScript support required
- CSS Grid and Flexbox support required

## Quick Start
1. Open `index.html` in a web browser
2. Navigate using the top navbar
3. Click "Projects" or navigate directly to `projects.html`
4. Toggle timeline view and explore projects

## Features Breakdown

### Responsive Design
- Desktop: Full layout with 4-column project grid
- Tablet (≤768px): Adjusted grid and simplified layouts
- Mobile (≤480px): Single column grid, optimized navigation

### Animations
- Fade-in effects on scroll
- Hover animations on cards
- Smooth transitions on all interactive elements
- Staggered animation on project cards (sequential appearance)

### Interactive Elements
- Navigation with smooth scrolling
- Timeline slider with live filtering
- Project modal with expanded details
- URL parameter support (e.g., `projects.html?filter=current`)

## URL Parameters
Navigate directly to filtered project views:
- `projects.html?filter=dead` - Shows dead projects in timeline
- `projects.html?filter=past` - Shows past projects in timeline
- `projects.html?filter=present` - Shows present projects
- `projects.html?filter=future` - Shows future projects

## Modular Architecture
The project data is completely separated from logic, making it easy to:
- Add projects by inserting one object into the `projects` array
- Update project information without touching any logic
- Integrate with a backend API by replacing `content.json`/`blog-data.json` with API calls
- Export data to JSON for external management

## Future Enhancements
- Connect to backend API for dynamic projects
- Add image upload functionality
- Implement dark mode toggle
- Add search/filter functionality
- Add blog section
- Email contact form

---

**Last Updated**: March 29, 2026
**Version**: 1.0
