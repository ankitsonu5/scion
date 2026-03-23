const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const root = __dirname;
const workbookPath = path.join(root, 'assets', 'Amazon Product List-.xlsx');
const workbook = XLSX.readFile(workbookPath);
const rows = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1'], { defval: '' });

const brandConfigs = [
    { prefix: 'product-ma-', brands: ["Maison de l'Avenir"] },
    { prefix: 'product-cl-', brands: ['Creation Lamis'] },
    { prefix: 'product-jpd-', brands: ['Jean Paul Dupont'] },
    { prefix: 'product-cpt-', brands: ['CP TRENDIES'] },
    { prefix: 'product-pc-', brands: ['PARIS COLLECTION', 'Paris Collection'] }
];

const explicitSearchTerms = {
    'product-cpt-alluring-beauty-make-up-kit.html': 'alluring makeup kit',
    'product-cpt-color-bar-makeup-kit.html': 'colorbar makeup kit',
    'product-cpt-cp-np-chic-shine-collection-box-10.html': null,
    'product-cpt-cp-np-eye-catching-brights-box-9.html': 'eye catching nail polish pack 9',
    'product-cpt-cp-np-glitter-explosion-box-11.html': null,
    'product-cpt-cp-np-ornamental-collection-box-4.html': 'ornamental collection nail polish pack 4',
    'product-cpt-cp-np-pastel-passion-box-8.html': 'pastel passion nail polish pack 8',
    'product-cpt-cp-np-vibrant-tips-box-2.html': 'vibrant tips nail polish pack 2',
    'product-cpt-elegant-make-up-kit.html': 'elegant makeup kit',
    'product-cpt-enticing-makeup-kit.html': 'enticing makeup kit',
    'product-cpt-exquisite-make-up-kit.html': 'exquisite makeup kit',
    'product-cpt-fashion-n-style-make-up-kit.html': 'fashion n style makeup kit',
    'product-cpt-radiance-make-up-kit.html': 'radiance makeup kit',
    'product-cpt-stunning-beauty-make-up-kit.html': 'stunning beauty makeup kit',
    'product-jpd-1.html': 'circuit 1',
    'product-jpd-aqueous.html': 'scripture aqueous',
    'product-jpd-black.html': 'scripture black',
    'product-jpd-blue.html': 'circuit blue',
    'product-jpd-c-est-majique.html': 'c est magique',
    'product-jpd-donna.html': 'connect donna',
    'product-jpd-ego-donna.html': 'connect ego donna',
    'product-jpd-goldust.html': 'scripture goldust',
    'product-jpd-men.html': null,
    'product-jpd-midnight-intense.html': 'scripture midnight intense',
    'product-jpd-mieux.html': 'tant mieux',
    'product-jpd-mieux-empress.html': 'tant mieux empress',
    'product-jpd-red.html': 'circuit red',
    'product-jpd-scripture-goldust-m.html': 'scripture goldust',
    'product-jpd-scripture-m.html': 'scripture men',
    'product-jpd-scripture-w.html': 'scripture women',
    'product-jpd-scripture-weirwood-m.html': 'scripture weirwood',
    'product-jpd-tant-mieux-w.html': 'tant mieux',
    'product-jpd-uomo.html': 'connect uomo',
    'product-jpd-uomo-exotic.html': 'connect uomo exotic',
    'product-jpd-uomo-noir.html': 'connect noir uomo',
    'product-jpd-weirwood.html': 'scripture weirwood',
    'product-jpd-women.html': null,
    'product-pc-anti-dandruff-hair-cream-unisex-475ml.html': null,
    'product-pc-baby-body-shampoo.html': 'baby bath shampoo',
    'product-pc-combo-image.html': '3pcs regime kit',
    'product-pc-morocan-argan-oil-hair-cream-475ml.html': 'moroccan argan oil hair cream 475ml',
    'product-pc-olive-hair-cream-unisex-475ml.html': null
};

const explicitItemIncludes = {
    'product-cpt-alluring-beauty-make-up-kit.html': 'makeup kit 86',
    'product-cpt-angelic-glow-makeup-kit.html': 'angelic glow',
    'product-cpt-block-buster-makeup-kit.html': 'block buster',
    'product-cpt-color-bar-makeup-kit.html': 'colorbar',
    'product-cpt-cp-np-eye-catching-brights-box-9.html': 'eye catching',
    'product-cpt-cp-np-ornamental-collection-box-4.html': 'ornamental collection',
    'product-cpt-cp-np-pastel-passion-box-8.html': 'pastel passion',
    'product-cpt-cp-np-vibrant-tips-box-2.html': 'vibrant tips',
    'product-cpt-elegant-make-up-kit.html': 'makeup kit 82',
    'product-cpt-enticing-makeup-kit.html': 'enticing',
    'product-cpt-exquisite-make-up-kit.html': 'exquisite',
    'product-cpt-fashion-n-style-make-up-kit.html': 'fashion n style',
    'product-cpt-radiance-make-up-kit.html': 'radiance',
    'product-cpt-stunning-beauty-make-up-kit.html': 'stunning beauty',
    'product-jpd-1.html': 'circuit 1',
    'product-jpd-aqua-delphino.html': 'aqua delphino',
    'product-jpd-aqueous.html': 'scripture aqueous',
    'product-jpd-black.html': 'scripture black',
    'product-jpd-blue.html': 'circuit blue',
    'product-jpd-c-est-majique.html': "c'est magique",
    'product-jpd-divine-red.html': 'divine red',
    'product-jpd-donna.html': 'connect donna -',
    'product-jpd-ego-donna.html': 'connect ego donna',
    'product-jpd-goldust.html': 'scripture goldust - long lasting perfume',
    'product-jpd-jasmine-ultime.html': 'jasmine ultime',
    'product-jpd-majestic-aura.html': 'majestic aura',
    'product-jpd-midnight-intense.html': 'scripture midnight intense',
    'product-jpd-mieux.html': 'tant mieux - long lasting perfume',
    'product-jpd-mieux-empress.html': 'tant mieux empress',
    'product-jpd-oud-supreme.html': 'oud supreme',
    'product-jpd-red.html': 'circuit red',
    'product-jpd-royal-ally.html': 'royal ally',
    'product-jpd-royal-crimson.html': 'royal crimson',
    'product-jpd-scripture-goldust-m.html': 'scripture goldust - long lasting perfume',
    'product-jpd-scripture-m.html': 'scripture - long lasting perfume for men',
    'product-jpd-scripture-w.html': 'scripture - long lasting perfume for women',
    'product-jpd-scripture-weirwood-m.html': 'scripture weirwood - long lasting perfume',
    'product-jpd-shades-of-desire.html': 'shades of desire',
    'product-jpd-silver-serene.html': 'silver serene',
    'product-jpd-solo-deseo.html': 'solo deseo',
    'product-jpd-tabacco-ricco.html': 'tabacco ricco',
    'product-jpd-tant-mieux-w.html': 'tant mieux - long lasting perfume',
    'product-jpd-totally-amazing.html': 'totally amazing',
    'product-jpd-uomo.html': 'connect uomo -',
    'product-jpd-uomo-exotic.html': 'connect uomo exotic',
    'product-jpd-uomo-noir.html': 'connect noir uomo',
    'product-jpd-vaniglia-e-tabacco.html': 'vaniglia e tabacco',
    'product-jpd-weirwood.html': 'scripture weirwood - long lasting perfume',
    'product-pc-3pcs-regime-kit.html': '3pcs regime kit',
    'product-pc-aloe-vera-gel-200ml.html': 'aloe vera gel',
    'product-pc-baby-body-lotion.html': 'baby body lotion',
    'product-pc-baby-body-oil.html': 'baby body oil',
    'product-pc-baby-body-shampoo.html': 'baby bath shampoo',
    'product-pc-baby-nappy-rash-cream.html': 'baby nappy rash cream',
    'product-pc-combo-image.html': '3pcs regime kit',
    'product-pc-keratin-smooth-hair-cream-475ml.html': 'keratin smooth hair cream',
    'product-pc-lanolin-hair-cream-475ml.html': 'lanolin hair cream',
    'product-pc-morocan-argan-oil-hair-cream-475ml.html': 'moroccan argan oil hair cream',
    'product-pc-volumising-treatment-hair-cream-475ml.html': 'volumising treatment hair cream'
};

const stopTokens = new Set([
    'product', 'make', 'up', 'kit', 'set', 'for', 'and', 'the', 'unisex',
    'women', 'woman', 'men', 'man', 'girls', 'girl', 'boys', 'boy', 'with',
    'long', 'lasting', 'perfume', 'eau', 'de', 'parfum', 'toilette', 'luxury',
    'premium', 'pack', 'box', 'pieces', 'piece', 'promo', 'gift'
]);

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function cleanRichText(value) {
    return String(value || '')
        .replace(/<\s*br\s*\/?>/gi, ' ')
        .replace(/<\s*\/p\s*>/gi, ' ')
        .replace(/<\s*p[^>]*>/gi, ' ')
        .replace(/<\s*li[^>]*>/gi, ' ')
        .replace(/<\s*\/li\s*>/gi, '. ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&lt;|&gt;/gi, ' ')
        .replace(/\u2022|✅|•/g, ' ')
        .replace(/\s*\.\s*\./g, '.')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalize(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/maison de l'avenir|creation lamis|jean paul dupont|\(jpd\)|cp trendies|paris collection|prive|privé/g, ' ')
        .replace(/eau de parfum|eau de toilette|gift set|all-in-one|ultimate color|for women|for men|unisex|body lotion|makeup kit|make up kit/g, ' ')
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function slug(value) {
    return normalize(value).replace(/\s+/g, '-');
}

function keyTokens(fileKey) {
    return slug(fileKey)
        .split('-')
        .filter(Boolean)
        .filter((token) => !stopTokens.has(token));
}

function get(row, keys) {
    for (const key of keys) {
        if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
            return String(row[key]).trim();
        }
    }
    return '';
}

function fileTitleKey(fileName, prefix) {
    return fileName.slice(prefix.length, -'.html'.length);
}

function readPageTitle(html) {
    const match = html.match(/<h1 class="pdp-title-amazon">([\s\S]*?)<\/h1>/);
    if (!match) return '';
    return match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function inferCategoryLabel(config, fileName, title) {
    const fileKey = fileTitleKey(fileName, config.prefix);
    const text = `${fileKey} ${title}`.toLowerCase();

    if (config.prefix === 'product-cpt-') {
        if (text.includes('cp-np-') || text.includes(' nail ') || text.includes('nail') || text.includes('polish')) return 'Nail Polish';
        if (text.includes('lipstick')) return 'Lipstick';
        return 'Make Up Kit';
    }

    if (config.prefix === 'product-pc-') {
        if (text.includes('baby')) return 'Baby Care';
        if (text.includes('hair cream')) return 'Hair Cream';
        if (text.includes('hair food')) return 'Hair Food';
        if (text.includes('aloe vera')) return 'Skin Care';
        if (text.includes('regime')) return 'Skin Care';
    }

    if (config.prefix === 'product-jpd-' || config.prefix === 'product-cl-' || config.prefix === 'product-ma-') {
        return 'Perfume';
    }

    return '';
}

function normalizeSearchTerms(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/scripture pour homme/g, 'scripture men')
        .replace(/scripture pour femme/g, 'scripture women')
        .replace(/connect noir uomo/g, 'uomo noir')
        .replace(/circuit/g, 'circuit')
        .replace(/c est/g, 'c est')
        .replace(/colourbar/g, 'colorbar')
        .replace(/morocan/g, 'moroccan')
        .replace(/bath shampoo/g, 'body shampoo')
        .replace(/#/g, ' ')
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function meaningfulTokens(value) {
    return normalizeSearchTerms(value)
        .split(' ')
        .filter(Boolean)
        .filter((token) => !stopTokens.has(token));
}

function scoreRow(row, searchKey, fileName) {
    const searchSlug = slug(searchKey);
    const tokens = meaningfulTokens(searchKey);
    if (!tokens.length) {
        return 0;
    }

    const candidates = [
        get(row, ['Amazon Item-name', 'Amazon Product Title ']),
        get(row, ['1 VOT Long Description']),
        get(row, ['Product Description', 'Description', 'Updated Description'])
    ].filter(Boolean);
    let best = 0;

    for (const candidate of candidates) {
        const candidateSlug = normalizeSearchTerms(candidate);
        if (!candidateSlug) continue;
        const matchedTokens = tokens.filter((token) => candidateSlug.includes(token));
        const coverage = matchedTokens.length / tokens.length;
        let score = 0;
        const packMatch = searchSlug.match(/\b(?:pack|box)\s*(\d+)\b/);
        if (packMatch && !candidateSlug.includes(packMatch[1])) continue;
        if (candidateSlug === searchSlug) score += 1200;
        if (candidateSlug.includes(searchSlug)) score += 500;
        score += matchedTokens.length * 50;
        if (coverage === 1) score += 400;
        else if (coverage >= 0.8) score += 180;
        else if (coverage >= 0.6) score += 60;
        if ((fileName.startsWith('product-cpt-') || fileName.startsWith('product-jpd-') || fileName.startsWith('product-pc-')) && coverage < 0.75) {
            score = 0;
        }
        best = Math.max(best, score);
    }

    return best;
}

function findExplicitRow(candidateRows, fileName) {
    const target = explicitItemIncludes[fileName];
    if (!target) return null;
    const normalizedTarget = normalizeSearchTerms(target);
    return candidateRows.find((row) => normalizeSearchTerms(get(row, ['Amazon Item-name', 'Amazon Product Title '])).includes(normalizedTarget)) || null;
}

function categoryAllowed(config, fileName, row) {
    const fileKey = fileTitleKey(fileName, config.prefix);
    const categoryText = `${get(row, ['Category', 'Collection/Category', 'Product Type'])} ${get(row, ['Amazon Item-name'])}`.toLowerCase();

    if (config.prefix === 'product-cpt-') {
        if (fileKey.startsWith('cp-np-')) return categoryText.includes('nail');
        if (fileKey.includes('lipstick')) return categoryText.includes('lipstick');
        return categoryText.includes('make up') || categoryText.includes('makeup');
    }

    if (config.prefix === 'product-pc-') {
        if (fileKey.includes('baby-')) return categoryText.includes('baby');
        if (fileKey.includes('hair-food')) return categoryText.includes('hair food');
        if (fileKey.includes('hair-cream')) return categoryText.includes('hair cream');
        if (fileKey.includes('hair-oil')) return categoryText.includes('hair oil');
        if (fileKey.includes('body-lotion')) return categoryText.includes('body lotion');
        if (fileKey.includes('body-oil')) return categoryText.includes('body oil') || categoryText.includes('baby');
        if (fileKey.includes('aloe-vera')) return categoryText.includes('aloe vera');
        if (fileKey.includes('3pcs-regime-kit')) return categoryText.includes('regime kit');
    }

    return true;
}

function buildMetaTable(row, brandLabel) {
    const entries = [
        ['Brand', brandLabel],
        ['Category', get(row, ['Product Type', 'Product Category', 'Category'])],
        ['Collection', get(row, ['Collection/Category', 'Collection'])],
        ['Target Group', get(row, ['Product Gender', 'Targeted Group'])],
        ['Fragrance Family', get(row, ['Fragrance Family'])]
    ].filter(([, value]) => value);

    const rowsHtml = entries.slice(0, 4).map(([label, value]) => `                            <tr>
                                <td class="label">${escapeHtml(label)}</td>
                                <td>${escapeHtml(value)}</td>
                            </tr>`).join('\n');

    return `<div class="pdp-meta-amazon">
                        <table>
${rowsHtml}
                        </table>
                    </div>`;
}

function buildGenericMetaTable(config, fileName, title) {
    const entries = [
        ['Brand', config.brands[0]],
        ['Category', inferCategoryLabel(config, fileName, title)],
        ['Product', title]
    ].filter(([, value]) => value);

    const rowsHtml = entries.map(([label, value]) => `                            <tr>
                                <td class="label">${escapeHtml(label)}</td>
                                <td>${escapeHtml(value)}</td>
                            </tr>`).join('\n');

    return `<div class="pdp-meta-amazon">
                        <table>
${rowsHtml}
                        </table>
                    </div>`;
}

function buildAbout(row) {
    const bullets = [
        get(row, ['Bullet point 1', 'Updated Bullet Point 1']),
        get(row, ['Bullet point 2', 'Updated Bullet Point 2']),
        get(row, ['Bullet point 3', 'Updated Bullet Point 3']),
        get(row, ['Bullet point 4', 'Updated Bullet Point 4']),
        get(row, ['Bullet point 5', 'Updated Bullet Point 5'])
    ].filter(Boolean);

    const items = (bullets.length ? bullets : ['Product information available on request.'])
        .map((line) => `                            <li>${escapeHtml(line)}</li>`).join('\n');

    return `<div class="pdp-about-bullets">
                        <h3>About this item</h3>
                        <ul>
${items}
                        </ul>
                    </div>`;
}

function buildInfoCards(row, brandLabel) {
    const entries = [
        ['Brand', brandLabel],
        ['Collection', get(row, ['Collection/Category', 'Collection'])],
        ['Product Type', get(row, ['Product Type', 'Product Category', 'Category'])],
        ['Target Group', get(row, ['Product Gender', 'Targeted Group'])],
        ['Fragrance Family', get(row, ['Fragrance Family'])]
    ].filter(([, value]) => value);

    return entries.map(([label, value]) => `                    <div class="pdp-info-card">
                        <span class="info-label">${escapeHtml(label)}</span>
                        <span class="info-value">${escapeHtml(value)}</span>
                    </div>`).join('\n');
}

function buildInfoTab(row, brandLabel) {
    const description = cleanRichText(get(row, ['Product Description', 'Description', 'Updated Description', '1 VOT Long Description'])) || 'Product information available on request.';
    return `<div class="tab-content" id="info" style="display: block;">
                <div class="pdp-info-rich">
                    <p class="pdp-info-description">${escapeHtml(description)}</p>
                    <div>
                        <h4 class="pdp-info-section-title">Product Details</h4>
                        <div class="pdp-info-grid">
${buildInfoCards(row, brandLabel)}
                        </div>
                    </div>
                </div>
            </div>`;
}

function buildGenericAbout(title, brandLabel) {
    const items = [
        `${title} is part of the ${brandLabel} collection.`,
        'See the product gallery for packaging, finish, and presentation details.',
        'Contact us for marketplace availability and complete specifications.'
    ].map((line) => `                            <li>${escapeHtml(line)}</li>`).join('\n');

    return `<div class="pdp-about-bullets">
                        <h3>About this item</h3>
                        <ul>
${items}
                        </ul>
                    </div>`;
}

function buildGenericInfoTab(title, brandLabel, config, fileName) {
    const description = `${title} from ${brandLabel}. Contact us for complete product specifications and current marketplace details.`;
    const entries = [
        ['Brand', brandLabel],
        ['Category', inferCategoryLabel(config, fileName, title)],
        ['Product', title]
    ].filter(([, value]) => value).map(([label, value]) => `                    <div class="pdp-info-card">
                        <span class="info-label">${escapeHtml(label)}</span>
                        <span class="info-value">${escapeHtml(value)}</span>
                    </div>`).join('\n');

    return `<div class="tab-content" id="info" style="display: block;">
                <div class="pdp-info-rich">
                    <p class="pdp-info-description">${escapeHtml(description)}</p>
                    <div>
                        <h4 class="pdp-info-section-title">Product Details</h4>
                        <div class="pdp-info-grid">
${entries}
                        </div>
                    </div>
                </div>
            </div>`;
}

function buildBuyBoxActions(row) {
    const amazonLink = get(row, ['ASIN link', 'USE Amazon link', 'USA Product Link', 'Product Link']);
    if (!amazonLink) return null;
    return `<div class="buy-box-actions">
                            <a href="${escapeHtml(amazonLink)}" target="_blank" rel="noopener noreferrer" class="pdp-amazon-btn">
                                <span class="market-copy">
                                    <strong>View on Amazon</strong>
                                    <span>Online availability</span>
                                </span>
                            </a>
                            <a href="contact-us.html" class="pdp-amazon-btn">
                                <span class="market-copy">
                                    <strong>Contact Us</strong>
                                    <span>Request more product details</span>
                                </span>
                            </a>
                        </div>`;
}

function replacePageBlocks(html, metaTable, aboutBlock, infoTab, actions) {
    html = html.replace(/<div class="pdp-meta-amazon">[\s\S]*?<\/div>\s*<div class="pdp-divider"><\/div>/, `${metaTable}\n\n                    <div class="pdp-divider"></div>`);
    html = html.replace(/<div class="pdp-about-bullets">[\s\S]*?<\/div>\s*(?=<div class="pdp-divider"><\/div>|<\/div>\s*<\/div>\s*<\/div>\s*<\/section>)/, `${aboutBlock}\n`);
    html = html.replace(/<div class="tab-content" id="info" style="display: block;">[\s\S]*?<\/div>\s*(?=<div class="tab-content"|<\/div>\s*<\/section>)/, `${infoTab}\n\n            `);

    if (actions && !html.includes('pdp-country-links')) {
        html = html.replace(/<div class="buy-box-actions">[\s\S]*?<\/div>\s*<\/div>\s*\n\n\s*<div class="pdp-about-bullets">/, `${actions}\n                    </div>\n\n                    <div class="pdp-about-bullets">`);
    }

    return html;
}

function updatePage(filePath, row, config) {
    let html = fs.readFileSync(filePath, 'utf8');
    const brandLabel = get(row, ['Brand', 'Brand ']) || config.brands[0];
    html = replacePageBlocks(
        html,
        buildMetaTable(row, brandLabel),
        buildAbout(row),
        buildInfoTab(row, brandLabel),
        buildBuyBoxActions(row)
    );
    fs.writeFileSync(filePath, html);
}

function applyGenericFallback(filePath, config, fileName) {
    let html = fs.readFileSync(filePath, 'utf8');
    const title = readPageTitle(html) || fileTitleKey(fileName, config.prefix).replace(/-/g, ' ');
    html = replacePageBlocks(
        html,
        buildGenericMetaTable(config, fileName, title),
        buildGenericAbout(title, config.brands[0]),
        buildGenericInfoTab(title, config.brands[0], config, fileName),
        null
    );
    fs.writeFileSync(filePath, html);
}

let updated = 0;
let matched = [];

for (const fileName of fs.readdirSync(root).filter((name) => name.endsWith('.html'))) {
    const config = brandConfigs.find((item) => fileName.startsWith(item.prefix));
    if (!config) continue;

    const filePath = path.join(root, fileName);
    const fileKey = fileTitleKey(fileName, config.prefix);
    const html = fs.readFileSync(filePath, 'utf8');
    const pageTitle = readPageTitle(html);
    const explicitSearch = Object.prototype.hasOwnProperty.call(explicitSearchTerms, fileName)
        ? explicitSearchTerms[fileName]
        : undefined;
    const searchKey = explicitSearch === undefined ? (pageTitle || fileKey) : explicitSearch;
    const candidateRows = rows.filter((row) => config.brands.includes(get(row, ['Brand', 'Brand '])));
    let bestRow = null;
    let bestScore = 0;

    bestRow = findExplicitRow(candidateRows, fileName);
    if (bestRow) {
        bestScore = 9999;
    }

    if (!bestRow && searchKey) {
        for (const row of candidateRows) {
            if (!categoryAllowed(config, fileName, row)) continue;
            const score = scoreRow(row, searchKey, fileName);
            if (score > bestScore) {
                bestScore = score;
                bestRow = row;
            }
        }
    }

    if (bestRow && bestScore >= 120) {
        updatePage(filePath, bestRow, config);
        updated += 1;
        matched.push(`${fileName} <= ${get(bestRow, ['Amazon Item-name', 'Amazon Product Title '])}`);
    } else if (explicitSearch === null || config.prefix === 'product-cpt-' || config.prefix === 'product-jpd-' || config.prefix === 'product-pc-') {
        applyGenericFallback(filePath, config, fileName);
    }
}

console.log(`Updated ${updated} product detail pages from Amazon workbook.`);
console.log(matched.slice(0, 40).join('\n'));
