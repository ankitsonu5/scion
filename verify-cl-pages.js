const fs = require('fs');
const path = require('path');

const products = [
    'cuir-ultime', 'amber-imperial', 'oud-magique', 'tabac-aromatique',
    'rose-augusta', 'sandal-intense', 'jasmine-joy', 'vanille-divine',
    'atar-al-afraah', 'jawharat-al-afrah', 'alhob-quloh', 'oud-al-mlouk'
];

let allOk = true;
products.forEach(p => {
    const htmlFile = `product-cl-${p}.html`;
    if (!fs.existsSync(htmlFile)) {
        console.error(`MISSING: ${htmlFile}`);
        allOk = false;
    } else {
        console.log(`EXISTS: ${htmlFile}`);
    }

    // Check for at least the first image
    const imgJpg = path.join('assets', `prod-cl-${p}-1.jpg`);
    const imgPng = path.join('assets', `prod-cl-${p}-1.png`);
    if (!fs.existsSync(imgJpg) && !fs.existsSync(imgPng)) {
        console.error(`MISSING IMAGE: prod-cl-${p}-1`);
        allOk = false;
    } else {
        console.log(`OK: prod-cl-${p}-1`);
    }
});

if (allOk) {
    console.log("All CL product pages and first images verified successfully.");
} else {
    process.exit(1);
}
