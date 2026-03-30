# Portfolio Website

Responsive portfolio site with three pages:

- Home page (`app/index.html`)
- Projects page (`app/projects.html`)
- Blog page (`app/blog.html`)

Content is JSON-driven and managed with a local Node.js CLI.

## Folder Structure

```text
portfolio/
├── app/
│   ├── index.html
│   ├── projects.html
│   ├── blog.html
│   └── styles.css
├── js/
│   ├── darkmode.js
│   ├── main.js
│   ├── projects.js
│   ├── blog.js
│   └── data.js (legacy, not used)
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
├── Images/
├── icons/
├── photos/
├── projects/
├── package.json
└── README.md
```

## Data Files

- `data/content.json`
  - intro, education, awards/milestones (with `dateAwarded`), social links, projects
- `data/blog-data.json`
  - blog posts, tags, links, images, LinkedIn URL support

## Run Locally

Use a local web server (Live Server, Five Server, or similar) and open:

- `app/index.html`

## Content Manager CLI

All commands run through:

- `node scripts/content-manager.js`

### Add Entries

```bash
node scripts/content-manager.js add project templates/new-project.json
node scripts/content-manager.js add award templates/new-award.json
node scripts/content-manager.js add education templates/new-education.json
node scripts/content-manager.js add blog templates/new-blog-post.json
```

### List Entries

```bash
node scripts/content-manager.js list project
node scripts/content-manager.js list award
node scripts/content-manager.js list education
node scripts/content-manager.js list blog
```

### Delete Entries By ID

```bash
node scripts/content-manager.js delete project 12
node scripts/content-manager.js delete award 3
node scripts/content-manager.js delete education 2
node scripts/content-manager.js delete blog post-001
```

### Generate New Blog Template

```bash
node scripts/content-manager.js new-template blog
```

Optional output path:

```bash
node scripts/content-manager.js new-template blog templates/my-blog-draft.json
```

### Generate New Award Template

```bash
node scripts/content-manager.js new-template award
```

Optional output path:

```bash
node scripts/content-manager.js new-template award templates/my-milestone-draft.json
```

## npm Shortcut Commands

```bash
npm run add:project -- templates/new-project.json
npm run add:award -- templates/new-award.json
npm run add:education -- templates/new-education.json
npm run add:blog -- templates/new-blog-post.json

npm run list:projects
npm run list:awards
npm run list:education
npm run list:blogs

npm run delete:project -- 12
npm run delete:award -- 3
npm run delete:education -- 2
npm run delete:blog -- post-001

npm run new:blog-template
npm run new:award-template
```

## Notes

- The CLI auto-generates an `id` if one is missing.
- New blog posts are inserted at the top of `data/blog-data.json`.
- Node.js is required for CLI and npm scripts.
