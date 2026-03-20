const fs = require('fs');
const path = require('path');

// Load MA data
let maData = {};
try {
    maData = JSON.parse(fs.readFileSync('ma_extracted_data.json', 'utf8'));
} catch (e) {
    console.error('Warning: ma_extracted_data.json not found or invalid');
}

function cleanAndFixFile(filePath) {
    const filename = path.basename(filePath);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Remove ALL duplicates of the new section if they exist
    const duplicatePattern = /<div class="pdp-about-bullets">[\s\S]*?<\/div>\s*<div class="pdp-about-bullets">[\s\S]*?<\/div>/g;
    if (duplicatePattern.test(content)) {
        // Keep only one
        content = content.replace(duplicatePattern, (match) => {
            const firstOne = match.match(/<div class="pdp-about-bullets">[\s\S]*?<\/div>/)[0];
            return firstOne;
        });
        console.log(`Fixed duplicates in ${filename}`);
    }

    // 2. Double check if any old about/desc sections are still there
    const aboutDivRegex = /<div class="pdp-about-amazon">[\s\S]*?<\/div>/g;
    const descDivRegex = /<div class="pdp-description">[\s\S]*?<\/div>/g;
    
    if (aboutDivRegex.test(content) || descDivRegex.test(content)) {
        content = content.replace(aboutDivRegex, '');
        content = content.replace(descDivRegex, '');
        console.log(`Removed stray sections in ${filename}`);
    }

    fs.writeFileSync(filePath, content);
}

const files = fs.readdirSync('.').filter(f => f.startsWith('product-') && f.endsWith('.html'));
files.forEach(cleanAndFixFile);
