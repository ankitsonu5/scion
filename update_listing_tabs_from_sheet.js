const fs = require('fs');
const path = require('path');

const root = __dirname;

function replaceFilterButtons(html, buttons) {
    const buttonsHtml = buttons.map(({ filter, label }, index) =>
        `            <button class="filter-btn${index === 0 ? ' active' : ''}" data-filter="${filter}">${label}</button>`
    ).join('\n');

    return html.replace(
        /(<div class="filter-section"[\s\S]*?<div class="container filter-container">\s*)[\s\S]*?(\s*<\/div>\s*<\/div>)/,
        `$1${buttonsHtml}$2`
    );
}

function replaceDataBrands(html, replacements) {
    for (const [from, to] of Object.entries(replacements)) {
        const pattern = new RegExp(`data-brand="${from}"`, 'g');
        html = html.replace(pattern, `data-brand="${to}"`);
    }
    return html;
}

const configs = [
    {
        file: 'products-cpt.html',
        buttons: [
            { filter: 'all', label: 'All Products' },
            { filter: 'makeup-kit', label: 'Make up Kit' },
            { filter: 'nail-polish', label: 'Nail Polish' },
            { filter: 'lipstick', label: 'Lipstick' }
        ],
        brands: {}
    },
    {
        file: 'products-cl.html',
        buttons: [
            { filter: 'all', label: 'All Products' },
            { filter: 'perfumes', label: 'Perfumes' },
            { filter: 'body-spray', label: 'Body Spray' },
            { filter: 'combos', label: 'Combos' }
        ],
        brands: {
            'gift-set': 'combos',
            'dlx': 'perfumes',
            'oriental': 'perfumes',
            'prive': 'perfumes',
            'standard': 'perfumes'
        }
    },
    {
        file: 'products-jpd.html',
        buttons: [
            { filter: 'all', label: 'All Products' },
            { filter: 'perfumes', label: 'Perfumes' },
            { filter: 'body-spray', label: 'Body Spray' },
            { filter: 'combos', label: 'Combos' }
        ],
        brands: {
            'circuit': 'perfumes',
            'connect': 'perfumes',
            'nova': 'perfumes',
            'prive': 'perfumes',
            'promo-pack': 'combos',
            'scripture': 'perfumes',
            'tant': 'perfumes'
        }
    },
    {
        file: 'products-pc.html',
        buttons: [
            { filter: 'all', label: 'All Products' },
            { filter: 'body-care', label: 'Body Care' },
            { filter: 'hair-care', label: 'Hair Care' },
            { filter: 'skin-care', label: 'Skin Care' },
            { filter: 'baby-care', label: 'Baby Care' }
        ],
        brands: {
            'regime-kit': 'skin-care',
            'aloe-vera': 'skin-care',
            'baby-care': 'baby-care',
            'combo': 'body-care',
            'hair-cream': 'hair-care',
            'hair-food': 'hair-care',
            'hair-oil': 'hair-care',
            'body-lotion': 'body-care'
        }
    }
];

let updated = 0;
for (const config of configs) {
    const filePath = path.join(root, config.file);
    let html = fs.readFileSync(filePath, 'utf8');
    const original = html;
    html = replaceFilterButtons(html, config.buttons);
    html = replaceDataBrands(html, config.brands);
    if (html !== original) {
        fs.writeFileSync(filePath, html);
        updated += 1;
    }
}

console.log(`Updated tabs on ${updated} listing pages.`);
