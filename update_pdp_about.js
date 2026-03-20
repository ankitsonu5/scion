const fs = require('fs');
const path = require('path');

// Load MA data (has pre-formatted bullets)
let maData = {};
try {
    maData = JSON.parse(fs.readFileSync('ma_extracted_data.json', 'utf8'));
} catch (e) {
    console.error('Warning: ma_extracted_data.json not found or invalid');
}

function updateFile(filePath) {
    const filename = path.basename(filePath);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Identify and extract existing "About" or "Description" section
    // Maison de l'Avenir pattern (div.pdp-about-amazon)
    const aboutDivRegex = /<div class="pdp-about-amazon">([\s\S]*?)<\/div>/;
    // Luxury detail pattern (div.pdp-description)
    const descDivRegex = /<div class="pdp-description">([\s\S]*?)<\/div>/;

    let extractedHtml = '';
    let matchAbout = content.match(aboutDivRegex);
    let matchDesc = content.match(descDivRegex);

    if (matchAbout) {
        extractedHtml = matchAbout[1];
        // Remove the original section + a trailing divider if it exists before it
        content = content.replace(aboutDivRegex, '');
    } else if (matchDesc) {
        extractedHtml = matchDesc[1];
        content = content.replace(descDivRegex, '');
    }

    // 2. Prepare the new "About Product" section
    let newSection = '';
    
    // Check if it's an MA product (use rich bullet data if available)
    let bullets = null;
    if (filename.startsWith('product-ma-')) {
        const slug = filename.replace('product-ma-', '').replace('.html', '');
        if (maData[slug]) {
            bullets = maData[slug].bullets;
        }
    }

    if (bullets) {
        newSection = `
                    <div class="pdp-about-bullets">
                        <h3>About this item</h3>
                        <ul>
                            ${bullets.map(b => `<li>${b}</li>`).join('\n                            ')}
                        </ul>
                    </div>`;
    } else if (extractedHtml) {
        // If not MA, use the extracted HTML but clean it up
        // If it's just paragraphs, try to bulletize if there are multiple
        let cleanedHtml = extractedHtml.trim();
        if (cleanedHtml.includes('<p>') && cleanedHtml.split('<p>').length > 2) {
            // Convert multiple paragraphs to bullets
            const items = cleanedHtml.match(/<p>([\s\S]*?)<\/p>/g) || [];
            const listItems = items.map(i => i.replace(/<\/?p>/g, '').trim()).filter(i => i);
            newSection = `
                    <div class="pdp-about-bullets">
                        <h3>About this item</h3>
                        <ul>
                            ${listItems.map(l => `<li>${l}</li>`).join('\n                            ')}
                        </ul>
                    </div>`;
        } else {
            // Just wrap the extracted HTML
            newSection = `
                    <div class="pdp-about-bullets">
                        <h3>About this item</h3>
                        <div class="about-content-text">
                            ${cleanedHtml}
                        </div>
                    </div>`;
        }
    }

    if (newSection) {
        // 3. Insert the new section below the hybrid-buy-box
        // We look for the end of the buy box and the divider that follows it
        const insertionPoint = /<\/div>\s*<div class="pdp-divider"><\/div>\s*<div class="pdp-share-amazon"/;
        
        if (insertionPoint.test(content)) {
            content = content.replace(insertionPoint, (match) => {
                // Match is something like </div>\n <div class="pdp-divider"></div>\n <div class="pdp-share-amazon"
                // We want to insert our section AFTER the first </div> (end of buy box)
                return `</div>\n\n                    ${newSection}\n\n                    <div class="pdp-divider"></div>\n\n                    <div class="pdp-share-amazon"`;
            });
            
            // Clean up any double dividers created by removal of original section
            // (Often there was a divider above/below the original section)
            content = content.replace(/<div class="pdp-divider"><\/div>\s*<div class="pdp-divider"><\/div>/g, '<div class="pdp-divider"></div>');

            fs.writeFileSync(filePath, content);
            console.log(`Updated ${filename}`);
        } else {
            console.log(`Could not find insertion point in ${filename}`);
        }
    } else {
        console.log(`No content to move in ${filename}`);
    }
}

// Find all product files
const files = fs.readdirSync('.').filter(f => f.startsWith('product-') && f.endsWith('.html'));
files.forEach(updateFile);
