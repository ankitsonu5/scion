const fs = require('fs');
const path = require('path');

const root = __dirname;
const indexPath = path.join(root, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');

const topBarMatch = indexHtml.match(/(\s*<!-- Top Bar -->[\s\S]*?)(\s*<!-- Navbar -->)/);
const footerMatch = indexHtml.match(/(\s*<footer>[\s\S]*?<\/footer>)/);

if (!topBarMatch || !footerMatch) {
    throw new Error('Could not extract top bar or footer from index.html');
}

const topBarBlock = topBarMatch[1];
const footerBlock = footerMatch[1];

const htmlFiles = fs.readdirSync(root).filter((name) => name.endsWith('.html'));
let updated = 0;

for (const file of htmlFiles) {
    const filePath = path.join(root, file);
    let html = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    if (file !== 'index.html') {
        const next = html.replace(/(\s*<!-- Top Bar -->[\s\S]*?)(\s*<!-- Navbar -->)/, `${topBarBlock}$2`);
        if (next !== html) {
            html = next;
            changed = true;
        }
    }

    const footerNext = html.replace(/\s*<footer>[\s\S]*?<\/footer>/, footerBlock);
    if (footerNext !== html) {
        html = footerNext;
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, html);
        updated += 1;
    }
}

console.log(`Synced top bar/footer on ${updated} pages.`);
