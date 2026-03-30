#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_PATH = path.join(ROOT, 'data', 'content.json');
const BLOG_PATH = path.join(ROOT, 'data', 'blog-data.json');

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
    fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function isTemplatePayload(filePath) {
    const templatesDir = path.join(ROOT, 'templates') + path.sep;
    const normalizedPath = path.resolve(filePath);
    return normalizedPath.startsWith(templatesDir) && normalizedPath.endsWith('.json');
}

function nextNumericId(items) {
    const ids = items.map(item => Number(item.id)).filter(Number.isFinite);
    return ids.length ? Math.max(...ids) + 1 : 1;
}

function usage() {
    console.log('Usage:');
    console.log('  node scripts/content-manager.js add <project|award|education|blog> <path-to-json>');
    console.log('  node scripts/content-manager.js delete <project|award|education|blog> <id>');
    console.log('  node scripts/content-manager.js list <project|award|education|blog>');
    console.log('  node scripts/content-manager.js new-template <blog|award> [output-path]');
    console.log('  node scripts/content-manager.js help');
    process.exit(1);
}

function printHelp() {
    console.log('Available direct commands:');
    console.log('  node scripts/content-manager.js add <project|award|education|blog> <path-to-json>');
    console.log('  node scripts/content-manager.js list <project|award|education|blog>');
    console.log('  node scripts/content-manager.js delete <project|award|education|blog> <id>');
    console.log('  node scripts/content-manager.js new-template <blog|award> [output-path]');
    console.log('  node scripts/content-manager.js help');
    console.log('');
    console.log('Available npm scripts:');
    console.log('  npm run help');
    console.log('  npm run add:project -- <path-to-json>');
    console.log('  npm run add:award -- <path-to-json>');
    console.log('  npm run add:education -- <path-to-json>');
    console.log('  npm run add:blog -- <path-to-json>');
    console.log('  npm run list:projects');
    console.log('  npm run list:awards');
    console.log('  npm run list:education');
    console.log('  npm run list:blogs');
    console.log('  npm run delete:project -- <id>');
    console.log('  npm run delete:award -- <id>');
    console.log('  npm run delete:education -- <id>');
    console.log('  npm run delete:blog -- <id>');
    console.log('  npm run new:blog-template');
    console.log('  npm run new:award-template');
}

function toIdString(value) {
    return String(value).trim();
}

function removeById(items, targetId) {
    const normalizedId = toIdString(targetId);
    const index = items.findIndex(item => toIdString(item.id) === normalizedId);
    if (index === -1) {
        return false;
    }
    items.splice(index, 1);
    return true;
}

function validateProject(project) {
    const required = ['type', 'title', 'image', 'summary', 'cardSummary', 'challenges', 'tools', 'link'];
    for (const field of required) {
        if (project[field] === undefined || project[field] === null) {
            throw new Error(`Project is missing required field: ${field}`);
        }
    }
    if (!Array.isArray(project.tools)) {
        throw new Error('Project field "tools" must be an array');
    }
}

function validateAward(award) {
    const required = ['title', 'issuer', 'dateAwarded', 'image'];
    for (const field of required) {
        if (!award[field]) {
            throw new Error(`Award is missing required field: ${field}`);
        }
    }

    if (Number.isNaN(Date.parse(award.dateAwarded))) {
        throw new Error('Award field "dateAwarded" must be a valid date (recommended format: YYYY-MM-DD)');
    }
}

function validateEducation(education) {
    const required = ['title', 'subject', 'institution', 'duration', 'image'];
    for (const field of required) {
        if (!education[field]) {
            throw new Error(`Education is missing required field: ${field}`);
        }
    }
}

function validateBlog(post) {
    const required = ['title', 'date', 'author', 'tags', 'summary', 'content', 'externalLinks', 'images'];
    for (const field of required) {
        if (post[field] === undefined || post[field] === null) {
            throw new Error(`Blog post is missing required field: ${field}`);
        }
    }
    if (!Array.isArray(post.tags)) {
        throw new Error('Blog field "tags" must be an array');
    }
    if (!Array.isArray(post.content)) {
        throw new Error('Blog field "content" must be an array');
    }
    if (!Array.isArray(post.externalLinks)) {
        throw new Error('Blog field "externalLinks" must be an array');
    }
    if (!Array.isArray(post.images)) {
        throw new Error('Blog field "images" must be an array');
    }
}

function addProject(payloadPath) {
    const content = readJson(CONTENT_PATH);
    const project = readJson(payloadPath);

    validateProject(project);

    if (!project.id) {
        project.id = nextNumericId(content.projects);
    }

    content.projects.push(project);
    writeJson(CONTENT_PATH, content);
    console.log(`Added project with id ${project.id}`);
}

function addAward(payloadPath) {
    const content = readJson(CONTENT_PATH);
    const award = readJson(payloadPath);

    validateAward(award);

    if (!award.id) {
        award.id = nextNumericId(content.awards);
    }

    content.awards.push(award);
    writeJson(CONTENT_PATH, content);
    console.log(`Added award with id ${award.id}`);
}

function addEducation(payloadPath) {
    const content = readJson(CONTENT_PATH);
    const education = readJson(payloadPath);

    validateEducation(education);

    if (!education.id) {
        education.id = nextNumericId(content.education);
    }

    content.education.push(education);
    writeJson(CONTENT_PATH, content);
    console.log(`Added education item with id ${education.id}`);
}

function addBlog(payloadPath) {
    const blogPosts = readJson(BLOG_PATH);
    const post = readJson(payloadPath);

    validateBlog(post);

    if (!post.id) {
        post.id = generateBlogId(blogPosts, post.date);
    }

    blogPosts.unshift(post);
    writeJson(BLOG_PATH, blogPosts);
    console.log(`Added blog post with id ${post.id}`);
}

function deleteProject(id) {
    const content = readJson(CONTENT_PATH);
    const removed = removeById(content.projects, id);
    if (!removed) {
        throw new Error(`No project found with id ${id}`);
    }
    writeJson(CONTENT_PATH, content);
    console.log(`Deleted project with id ${id}`);
}

function deleteAward(id) {
    const content = readJson(CONTENT_PATH);
    const removed = removeById(content.awards, id);
    if (!removed) {
        throw new Error(`No award found with id ${id}`);
    }
    writeJson(CONTENT_PATH, content);
    console.log(`Deleted award with id ${id}`);
}

function deleteEducation(id) {
    const content = readJson(CONTENT_PATH);
    const removed = removeById(content.education, id);
    if (!removed) {
        throw new Error(`No education item found with id ${id}`);
    }
    writeJson(CONTENT_PATH, content);
    console.log(`Deleted education item with id ${id}`);
}

function deleteBlog(id) {
    const blogPosts = readJson(BLOG_PATH);
    const removed = removeById(blogPosts, id);
    if (!removed) {
        throw new Error(`No blog post found with id ${id}`);
    }
    writeJson(BLOG_PATH, blogPosts);
    console.log(`Deleted blog post with id ${id}`);
}

function getTodayDate() {
    return new Date().toISOString().slice(0, 10);
}

function generateBlogId(blogPosts, date) {
    const compactDate = String(date || getTodayDate()).replace(/-/g, '');
    const prefix = `post-${compactDate}-`;
    const used = new Set(
        blogPosts
            .map(post => toIdString(post.id))
            .filter(id => id.startsWith(prefix))
    );

    let sequence = 1;
    while (true) {
        const suffix = String(sequence).padStart(2, '0');
        const candidate = `${prefix}${suffix}`;
        if (!used.has(candidate)) {
            return candidate;
        }
        sequence += 1;
    }
}

function createBlogTemplate(outputPath) {
    const date = getTodayDate();
    const template = {
        title: 'New Blog Post',
        date,
        author: 'Nikola Jankovic',
        tags: ['tag1', 'tag2'],
        summary: 'Short summary for the card preview.',
        content: ['Paragraph 1', 'Paragraph 2'],
        externalLinks: [
            {
                title: 'Reference',
                url: 'https://example.com'
            }
        ],
        images: ['photos/image1.png'],
        linkedinPostUrl: ''
    };

    const defaultPath = path.join(ROOT, 'templates', `new-blog-post-${date}.json`);
    const targetPath = outputPath ? path.resolve(process.cwd(), outputPath) : defaultPath;

    if (fs.existsSync(targetPath)) {
        throw new Error(`Template already exists: ${targetPath}`);
    }

    writeJson(targetPath, template);
    console.log(`Created blog template: ${targetPath}`);
}

function createAwardTemplate(outputPath) {
    const date = getTodayDate();
    const template = {
        title: 'New Milestone',
        issuer: 'Award Issuer 2026',
        dateAwarded: date,
        image: 'https://example.com/award-image.png'
    };

    const defaultPath = path.join(ROOT, 'templates', `new-award-${date}.json`);
    const targetPath = outputPath ? path.resolve(process.cwd(), outputPath) : defaultPath;

    if (fs.existsSync(targetPath)) {
        throw new Error(`Template already exists: ${targetPath}`);
    }

    writeJson(targetPath, template);
    console.log(`Created award template: ${targetPath}`);
}

function printList(label, items) {
    if (!items.length) {
        console.log(`No ${label} found.`);
        return;
    }

    items.forEach(item => {
        const id = toIdString(item.id);
        const title = item.title || item.platform || item.subject || 'Untitled';
        console.log(`${id} | ${title}`);
    });
}

function listEntries(type) {
    if (type === 'project') {
        const content = readJson(CONTENT_PATH);
        printList('projects', content.projects || []);
        return;
    }

    if (type === 'award') {
        const content = readJson(CONTENT_PATH);
        printList('awards', content.awards || []);
        return;
    }

    if (type === 'education') {
        const content = readJson(CONTENT_PATH);
        printList('education items', content.education || []);
        return;
    }

    if (type === 'blog') {
        const blogPosts = readJson(BLOG_PATH);
        printList('blog posts', blogPosts || []);
        return;
    }

    usage();
}

function main() {
    const [, , command, type, arg] = process.argv;

    if (!command) {
        usage();
    }

    if (command === 'help' || command === '--help' || command === '-h') {
        printHelp();
        return;
    }

    if (command === 'add') {
        if (!type || !arg) {
            usage();
        }

        const resolvedPayloadPath = path.resolve(process.cwd(), arg);
        if (!fs.existsSync(resolvedPayloadPath)) {
            throw new Error(`Payload file does not exist: ${resolvedPayloadPath}`);
        }

        if (type === 'project') {
            addProject(resolvedPayloadPath);
        } else if (type === 'award') {
            addAward(resolvedPayloadPath);
        } else if (type === 'education') {
            addEducation(resolvedPayloadPath);
        } else if (type === 'blog') {
            addBlog(resolvedPayloadPath);
        } else {
            usage();
        }

        if (isTemplatePayload(resolvedPayloadPath)) {
            fs.unlinkSync(resolvedPayloadPath);
            console.log(`Deleted template file: ${resolvedPayloadPath}`);
        }

        return;
    }

    if (command === 'delete') {
        if (!type || !arg) {
            usage();
        }

        if (type === 'project') {
            deleteProject(arg);
        } else if (type === 'award') {
            deleteAward(arg);
        } else if (type === 'education') {
            deleteEducation(arg);
        } else if (type === 'blog') {
            deleteBlog(arg);
        } else {
            usage();
        }
        return;
    }

    if (command === 'new-template') {
        if (type === 'blog') {
            createBlogTemplate(arg);
            return;
        }

        if (type === 'award') {
            createAwardTemplate(arg);
            return;
        }

        usage();
    }

    if (command === 'list') {
        if (!type) {
            usage();
        }
        listEntries(type);
        return;
    }

    usage();
}

try {
    main();
} catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
}
