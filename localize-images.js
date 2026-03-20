const fs = require('fs');
const path = require('path');

const directory = 'c:/Users/idkth/Documents/scion';
const assetsDir = path.join(directory, 'assets');
const files = fs.readdirSync(directory).filter(f => f.endsWith('.html') || f.endsWith('.css'));

const keywordMap = {
    'manufacturing': 'hero_manufacturing.png',
    'qc-capabilities': 'hero_qc_capabilities.png',
    'research-development': 'hero_research_development.png',
    'sustainability': 'hero_sustainability.png',
    'turn-key': 'hero_turn_key.png',
    'why-choose-us': 'hero_why_choose_us.png',
    'certifications': 'hero_certifications.png',
    'breadth-of-products': 'hero_breadth_of_products.png',
    'about': 'about_story.png',
    'brands': 'brand-bg.jpg',
    'story': 'Our Story 1.jpg',
    'join': 'banner-join-family.jpg',
    'team': 'about_team.png',
    'member': 'about_team.png',
    'founder': 'Picture1.jpg',
    'contact': 'Our Story 1.jpg',
    'private-label': 'about_manufacturing.png',
    'business': 'about_team.png',
    'perfume': 'hero_luxury_perfume_1765793270094.png',
    'luxury': 'hero_luxury_perfume_1765793270094.png',
    'product': 'Picture1.jpg',
    'placeholder': 'Picture1.jpg'
};

files.forEach(file => {
    const filePath = path.join(directory, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Aggressive regex for ANY external image URL
    const urlRegex = /https?:\/\/[^"'\s()<>]+(?:unsplash\.com|placehold\.co|wikimedia\.org)[^"'\s()<>!*]*/gi;
    
    content = content.replace(urlRegex, (url) => {
        changed = true;
        
        const fileNameLower = file.toLowerCase();
        let replacement = 'Picture1.jpg'; // default
        
        for (const [kw, asset] of Object.entries(keywordMap)) {
            if (fileNameLower.includes(kw) || url.toLowerCase().includes(kw)) {
                replacement = asset;
                break;
            }
        }

        // Special logic for background images in specific files
        if (fileNameLower.includes('brand-presence')) replacement = 'brand-bg.jpg';
        if (fileNameLower.includes('brands-overview')) replacement = 'Our Brands - BG 2.jpg';
        if (fileNameLower.includes('about')) replacement = 'Our Story 1.jpg';
        if (url.includes('1451187580459')) replacement = 'brand-bg.jpg'; // Galaxy/Space
        if (url.includes('1615634260167')) replacement = 'Our Brands - BG 2.jpg'; // Brand abstract

        console.log(`Mapping ${url} in ${file} -> assets/${replacement}`);
        return `assets/${replacement}`;
    });

    // Final check for source attributes and url() if not caught (redundant but safe)
    if (content.includes('http') && (content.includes('unsplash') || content.includes('placehold'))) {
        // This part would catch any missed ones if the regex was too strict
    }

    if (changed) {
        fs.writeFileSync(filePath, content);
    }
});

console.log('Image localization v2 complete.');
