# Portfolio Website

A JSON-driven personal portfolio with three main pages:

- Home (`app/index.html`)
- Projects (`app/projects.html`)
- Blog (`app/blog.html`)

The site uses plain HTML/CSS/JavaScript and a Node.js content manager for updating JSON content.

## Current Highlights

- Milestones section on Home (data key remains `awards` in `data/content.json`):
  - sorted by `dateAwarded` (newest first)
  - carousel-style pagination showing 5 items per step
- Blog archive:
  - year/month archive tree
  - `All time` button to reset to default all-posts view (date-sorted)
- Responsive layout across desktop/tablet/mobile
- Light/Dark mode support

## Project Structure

```text
Portfolio/
├── app/
│   ├── index.html
│   ├── projects.html
│   ├── blog.html
│   └── styles.css
├── js/
│   ├── main.js
│   ├── projects.js
│   ├── blog.js
│   ├── darkmode.js
│   └── data.js
├── data/
│   ├── content.json
│   └── blog-data.json
├── scripts/
│   └── content-manager.js
├── templates/
│   ├── new-project.json
│   ├── new-award.json
│   ├── new-education.json
│   └── new-blog-post.json
├── icons/
├── images/
├── index.html
├── projects.html
├── blog.html
├── package.json
└── README.md
```

Notes:

- `app/` contains the active page files and shared stylesheet.
- Root-level `index.html`, `projects.html`, and `blog.html` are also present in this repository.

## Data Model

### `data/content.json`

Contains:

- `intro`
- `education`
- `awards` (rendered as Milestones on Home)
- `socialLinks`
- `projects`

Milestone/award entries should include:

- `title`
- `issuer`
- `dateAwarded` (recommended format: `YYYY-MM-DD`)
- `image`

### `data/blog-data.json`

Blog posts with fields like:

- `id`
- `title`
- `date`
- `author`
- `tags`
- `summary`
- `content`
- `externalLinks`
- `images`
- `linkedinPostUrl` (optional)

## Run Locally

Use any local static server (for example Live Server in VS Code), then open:

- `app/index.html`

## Content Manager CLI

Base command:

```bash
node scripts/content-manager.js <command>
```

### Help

```bash
node scripts/content-manager.js help
```

### Add Entries

```bash
node scripts/content-manager.js add project [path-to-json]
node scripts/content-manager.js add award [path-to-json]
node scripts/content-manager.js add education [path-to-json]
node scripts/content-manager.js add blog [path-to-json]
```

If `path-to-json` is omitted, the command uses the active short template in `templates/`:

- `project` -> `templates/p.json`
- `award` -> `templates/a.json`
- `education` -> `templates/e.json`
- `blog` -> `templates/b.json`

### List Entries

```bash
node scripts/content-manager.js list project
node scripts/content-manager.js list award
node scripts/content-manager.js list education
node scripts/content-manager.js list blog
```

### Delete Entries

```bash
node scripts/content-manager.js delete project <id>
node scripts/content-manager.js delete award <id>
node scripts/content-manager.js delete education <id>
node scripts/content-manager.js delete blog <id>
```

### Generate Templates

```bash
node scripts/content-manager.js new project
node scripts/content-manager.js new education
node scripts/content-manager.js new-template blog
node scripts/content-manager.js new-template award
```

Default short template outputs:

- `project` -> `templates/p.json`
- `award` -> `templates/a.json`
- `education` -> `templates/e.json`
- `blog` -> `templates/b.json`

Optional custom output paths:

```bash
node scripts/content-manager.js new-template blog templates/my-blog-draft.json
node scripts/content-manager.js new-template award templates/my-milestone-draft.json
```

## npm Scripts

```bash
npm run help

npm run new:project
npm run new:award
npm run new:education
npm run new:blog
npm run new:project-template
npm run new:education-template
npm run new:blog-template
npm run new:award-template

npm run add:project -- <path-to-json>
npm run add:award -- <path-to-json>
npm run add:education -- <path-to-json>
npm run add:blog -- <path-to-json>

npm run list:projects
npm run list:awards
npm run list:education
npm run list:blogs

npm run delete:project -- <id>
npm run delete:award -- <id>
npm run delete:education -- <id>
npm run delete:blog -- <id>
```

## Notes

- IDs are auto-generated when omitted for supported content types.
- Blog posts are sorted by date descending in the UI.
- Adding from reusable short templates (`templates/p.json`, `templates/a.json`, `templates/e.json`, `templates/b.json`) keeps the file.
- Adding from other JSON files inside `templates/` deletes that template file after successful add.
- Node.js is required for CLI/npm commands.
