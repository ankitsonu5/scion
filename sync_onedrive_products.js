const fs = require('fs');
const path = require('path');

const root = __dirname;
const rootCandidates = [
    path.join(root, 'assets', '2. Shared with agency folder', 'Brands'),
    path.join(root, 'assets', 'OneDrive_2026-03-19 (2)', '2. Shared with agency folder', 'Brands')
];
const oneDriveRoot = rootCandidates.find((candidate) => fs.existsSync(candidate));

if (!oneDriveRoot) {
    throw new Error('Shared agency brand assets directory not found.');
}

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const brandConfigs = [
    {
        key: 'jpd',
        brandName: 'Jean Paul Dupont',
        listingFile: 'products-jpd.html',
        listingId: 'jpd-products-placeholder',
        listingHref: 'products-jpd.html',
        introLabel: 'Prestige Fragrance Portfolio',
        sourceDir: 'JPD',
        collectionMap: {
            'JPD Circuit': { filter: 'circuit', label: 'Circuit' },
            'JPD Connect': { filter: 'connect', label: 'Connect' },
            'JPD Nova': { filter: 'nova', label: 'Nova' },
            "JPD Prive'": { filter: 'prive', label: "Prive'" },
            'JPD Promo Pack': { filter: 'promo-pack', label: 'Promo Pack' },
            'JPD Scripture': { filter: 'scripture', label: 'Scripture' },
            'JPD Tant': { filter: 'tant', label: 'Tant' }
        }
    },
    {
        key: 'cpt',
        brandName: 'CP Trendies',
        listingFile: 'products-cpt.html',
        listingId: 'cpt-products-placeholder',
        listingHref: 'products-cpt.html',
        introLabel: 'Color Cosmetics Portfolio',
        sourceDir: 'CPT',
        collectionMap: {
            'MakeUp Kits': { filter: 'makeup-kit', label: 'MakeUp Kits' },
            'Nail Polish': { filter: 'nail-polish', label: 'Nail Polish' }
        }
    },
    {
        key: 'pc',
        brandName: 'Paris Collection',
        listingFile: 'products-pc.html',
        listingId: 'pc-products-placeholder',
        listingHref: 'products-pc.html',
        introLabel: 'Personal Care Portfolio',
        sourceDir: 'PC',
        collectionMap: {
            'PC 3PCS Regime Kit': { filter: 'regime-kit', label: '3PCS Regime Kit' },
            'PC Aloe Vera Gel 200ml': { filter: 'aloe-vera', label: 'Aloe Vera Gel' },
            'PC Baby Care PLP': { filter: 'baby-care', label: 'Baby Care' },
            'PC Combo image': { filter: 'combo', label: 'Combo' },
            'PC_Hair Cream': { filter: 'hair-cream', label: 'Hair Cream' },
            'PC_Hair Food': { filter: 'hair-food', label: 'Hair Food' },
            'PC_Hair Oil': { filter: 'hair-oil', label: 'Hair Oil' },
            'PC_Perfumed Body Lotion': { filter: 'body-lotion', label: 'Body Lotion' }
        }
    }
];

function slugify(value) {
    return value
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function encodeRelative(filePath) {
    return filePath.split(/[\\/]+/).map(encodeURIComponent).join('/');
}

function cleanTitle(name, brandKey) {
    let cleaned = name
        .replace(/\.[^.]+$/, '')
        .replace(/_/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (brandKey === 'jpd') {
        cleaned = cleaned
            .replace(/^JPD\s*-\s*NOVA COLLECTION\s*/i, '')
            .replace(/^JPD\s*NOVA COLLECTION\s*/i, '')
            .replace(/^JPD\s*PRIVE\s*[-_ ]*/i, '')
            .replace(/^JPD\s*PRIVE'\s*[-_ ]*/i, '')
            .replace(/^JPD\s*PRIVE\s*/i, '')
            .replace(/^JPD\s*PROMO PACK\s*/i, '')
            .replace(/^JPD\s*SCRIPTURE\s*/i, '')
            .replace(/^JPD\s*TANT\s*/i, '')
            .replace(/^JPD\s*CONNECT\s*/i, '')
            .replace(/^JPD\s*CIRCUIT\s*/i, '')
            .replace(/^JPD\s+/i, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    if (brandKey === 'cpt') {
        cleaned = cleaned
            .replace(/^CPT[_\s-]*/i, '')
            .replace(/\s*PLP$/i, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    if (brandKey === 'pc') {
        cleaned = cleaned
            .replace(/^PC[_\s-]*/i, '')
            .replace(/\s*PLP$/i, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    cleaned = cleaned
        .replace(/\s+-\s+/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();

    return cleaned || name;
}

function brandDescription(product) {
    if (product.brandKey === 'jpd') {
        return `${product.brandName} ${product.title} is part of the ${product.collectionLabel} line. This detail page presents the product with its main visuals and core information for catalogue, website, and export presentation use.`;
    }

    if (product.brandKey === 'cpt') {
        return `${product.brandName} ${product.title} is part of the ${product.collectionLabel} portfolio. This page highlights the product with its key visuals and essential information in a clear presentation format.`;
    }

    return `${product.brandName} ${product.title} is included in the ${product.collectionLabel} range. This page presents the product with its gallery and essential information for catalogue, website, and sales use.`;
}

function aboutBullets(product) {
    return [
        `${product.title} is part of the ${product.collectionLabel} collection under ${product.brandName}.`,
        `The gallery includes ${product.images.length} product visual${product.images.length === 1 ? '' : 's'} showing packaging and presentation details.`,
        `This page is structured to support product review, catalogue planning, and website merchandising.`,
        `${product.title} is presented here with a focused overview of the product and its associated visuals.`
    ];
}

function infoCards(product) {
    return [
        ['Brand', product.brandName],
        ['Collection', product.collectionLabel],
        ['Product Name', product.title],
        ['Asset Count', String(product.images.length)]
    ];
}

function collectImages(dirPath) {
    return fs.readdirSync(dirPath, { withFileTypes: true })
        .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
        .map((entry) => entry.name)
        .sort(compareImages);
}

function imageRank(name) {
    const normalized = path.basename(name, path.extname(name)).toLowerCase();
    let rank = 100;

    if (/\b(plp[_ -]?1|01|hero|main)\b/.test(normalized)) {
        rank -= 40;
    }

    if (normalized.includes('benefit') || normalized.includes('benefits')) {
        rank += 20;
    }

    if (normalized.includes('claim')) {
        rank += 20;
    }

    if (normalized.includes('ingredient')) {
        rank += 20;
    }

    if (normalized.includes('how to use')) {
        rank += 25;
    }

    if (normalized.includes('range')) {
        rank += 25;
    }

    if (/pack of \d/.test(normalized)) {
        rank += 15;
    }

    return rank;
}

function compareImages(a, b) {
    const rankDiff = imageRank(a) - imageRank(b);
    if (rankDiff !== 0) {
        return rankDiff;
    }

    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function discoverProducts(config) {
    const brandRoot = path.join(oneDriveRoot, config.sourceDir);
    const products = [];

    for (const [collectionDir, collectionMeta] of Object.entries(config.collectionMap)) {
        const collectionRoot = path.join(brandRoot, collectionDir);
        if (!fs.existsSync(collectionRoot)) {
            continue;
        }

        const subdirs = fs.readdirSync(collectionRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory());

        if (subdirs.length > 0) {
            for (const subdir of subdirs) {
                const productRoot = path.join(collectionRoot, subdir.name);
                const images = collectImages(productRoot);
                if (!images.length) {
                    continue;
                }

                const title = cleanTitle(subdir.name, config.key);
                products.push({
                    brandKey: config.key,
                    brandName: config.brandName,
                    collectionLabel: collectionMeta.label,
                    filter: collectionMeta.filter,
                    title,
                    slug: `${config.key}-${slugify(title)}`,
                    sourceFolder: path.relative(root, productRoot).replace(/\\/g, '/'),
                    imageRoot: path.relative(root, productRoot).replace(/\\/g, '/'),
                    images
                });
            }
        } else {
            const images = collectImages(collectionRoot);
            if (!images.length) {
                continue;
            }

            const title = cleanTitle(collectionDir, config.key);
            products.push({
                brandKey: config.key,
                brandName: config.brandName,
                collectionLabel: collectionMeta.label,
                filter: collectionMeta.filter,
                title,
                slug: `${config.key}-${slugify(title)}`,
                sourceFolder: path.relative(root, collectionRoot).replace(/\\/g, '/'),
                imageRoot: path.relative(root, collectionRoot).replace(/\\/g, '/'),
                images
            });
        }
    }

    return products.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
}

function renderDetailPage(product, config) {
    const imagePaths = product.images.map((name) => encodeRelative(`${product.imageRoot}/${name}`));
    const mainImage = imagePaths[0];
    const thumbs = imagePaths.map((src, index) => `                            <div class="pdp-thumb-v${index === 0 ? ' active' : ''}" onclick="changeImage(this)">
                                <img src="${src}" alt="${escapeHtml(product.title)} view ${index + 1}">
                            </div>`).join('\n');
    const bullets = aboutBullets(product).map((bullet) => `                            <li>${escapeHtml(bullet)}</li>`).join('\n');
    const cards = infoCards(product).map(([label, value]) => `                    <div class="pdp-info-card">
                        <span class="info-label">${escapeHtml(label)}</span>
                        <span class="info-value">${escapeHtml(value)}</span>
                    </div>`).join('\n');
    const visualBullets = product.images.map((image) => `                            <li>${escapeHtml(path.basename(image, path.extname(image)))}</li>`).join('\n');

    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(product.title)} | Scion International</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="style-luxury.css">
    <link rel="stylesheet" href="pdp-amazon.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
</head>

<body>
    <div class="top-bar">
        <div class="container top-bar-container">
            <div class="top-bar-left">
                <a href="mailto:info@scionintl.com"><i class="fas fa-envelope"></i> info@scionintl.com</a>
                <a href="tel:+97165352066"><i class="fas fa-phone"></i> +971 65352066</a>
            </div>
                <div class="top-bar-right">
                    <div class="social-icons-top">
                    <a href="https://www.facebook.com/scioninternational"><i class="fab fa-facebook-f"></i></a>
                    <a href="https://in.linkedin.com/company/scion-international"><i class="fab fa-linkedin-in"></i></a>
                    <a href="https://www.instagram.com/scioninternational/"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
    </div>

    <nav class="navbar">
        <div class="container nav-container">
            <a href="index.html" class="logo"><img src="assets/scion-logo.png" alt="Scion International"></a>
            <span class="nav-beta-badge">Beta Version</span>
            <div class="nav-links">
                <a href="index.html">HOME</a>
                <div class="dropdown">
                    <a href="about-luxury.html">WHO WE ARE <i class="fas fa-chevron-down"></i></a>
                    <div class="dropdown-content">
                        <a href="about.html">Our Story</a>
                        <a href="global-network-luxury.html">Our Global Network</a>
                        <a href="business-overview-luxury.html">Business Overview</a>
                        <a href="private-label-premium.html">Private Label Projects &amp; Clients</a>
                        <a href="business-strengths-premium.html">Business Strengths</a>
                        <a href="values-ethos-luxury.html">Our Values &amp; Ethos</a>
                    </div>
                </div>
                <div class="dropdown">
                    <a href="#">WHY CHOOSE US <i class="fas fa-chevron-down"></i></a>
                    <div class="dropdown-content">
                        <a href="why-choose-us-overview-luxury.html">Overview</a>
                        <a href="research-development-luxury.html">R &amp; D Capabilities</a>
                        <a href="qc-capabilities-luxury.html">QC Capabilities</a>
                        <a href="manufacturing-capabilities-luxury.html">Manufacturing Capabilities</a>
                        <a href="breadth-of-products-luxury.html">Breadth of Products</a>
                        <a href="turn-key-projects-luxury.html">Turn Key Projects</a>
                        <a href="sustainability-luxury.html">Sustainability</a>
                        <a href="certifications-luxury.html">Certifications</a>
                    </div>
                </div>
                <div class="dropdown">
                    <a href="#">BRANDS <i class="fas fa-chevron-down"></i></a>
                    <div class="dropdown-content mega-menu">
                        <div class="mega-column">
                            <h3>Perfumes and Deodorants</h3>
                            <a href="products-ma.html">Maison de l'Avenir</a>
                            <a href="products-jpd.html">Jean Paul Dupont</a>
                            <a href="products-cl.html">Creation Lamis</a>
                        </div>
                        <div class="mega-column">
                            <h3>Personal Care and Color Cosmetics</h3>
                            <a href="products-pc.html">Paris Collection</a>
                            <a href="products-cpt.html">CP Trendies</a>
                        </div>
                    </div>
                </div>
                <a href="careers.html">CAREERS</a>
                <a href="contact-us.html">CONTACT US</a>
            </div>
        </div>
    </nav>

    <div class="breadcrumb-luxury">
        <div class="container">
            <a href="index.html">Home</a> <span class="separator">/</span>
            <a href="${config.listingHref}">${escapeHtml(product.brandName)}</a> <span class="separator">/</span>
            <span class="current">${escapeHtml(product.title)}</span>
        </div>
    </div>

    <section class="pdp-container">
        <div class="container">
            <div class="pdp-main-grid">
                <div class="pdp-gallery-sticky" data-aos="fade-right">
                    <div class="pdp-gallery-flex">
                        <div class="pdp-thumbnails-vertical">
${thumbs}
                        </div>
                        <div class="pdp-main-image-wrap">
                            <img src="${mainImage}" id="mainImage" alt="${escapeHtml(product.title)}">
                        </div>
                    </div>
                </div>

                <div class="pdp-product-info" data-aos="fade-left">
                    <a href="${config.listingHref}" class="pdp-brand-link">Browse the ${escapeHtml(product.brandName)} portfolio</a>
                    <h1 class="pdp-title-amazon">${escapeHtml(product.title)}</h1>

                    <div class="pdp-meta-amazon">
                        <table>
                            <tr>
                                <td class="label">Brand</td>
                                <td>${escapeHtml(product.brandName)}</td>
                            </tr>
                            <tr>
                                <td class="label">Collection</td>
                                <td>${escapeHtml(product.collectionLabel)}</td>
                            </tr>
                            <tr>
                                <td class="label">Portfolio Type</td>
                                <td>${escapeHtml(config.introLabel)}</td>
                            </tr>
                            <tr>
                                <td class="label">Visual Assets</td>
                                <td>${escapeHtml(String(product.images.length))}</td>
                            </tr>
                        </table>
                    </div>

                    <div class="pdp-divider"></div>

                    <div class="hybrid-buy-box">
                        <div class="buy-box-price">
                            <span class="currency">Product Portfolio</span>
                        </div>
                        <div class="buy-box-actions">
                            <a href="${config.listingHref}" class="pdp-amazon-btn">
                                <span class="market-copy">
                                    <strong>View Collection</strong>
                                    <span>${escapeHtml(product.collectionLabel)}</span>
                                </span>
                            </a>
                            <a href="contact-us.html" class="pdp-amazon-btn">
                                <span class="market-copy">
                                    <strong>Contact Us</strong>
                                    <span>Request more product details</span>
                                </span>
                            </a>
                        </div>
                    </div>

                    <div class="pdp-about-bullets">
                        <h3>About this product</h3>
                        <ul>
${bullets}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="pdp-details-tabs">
        <div class="container">
            <div class="tabs-header">
                <button class="tab-btn active" onclick="openTab(event, 'info')">Information</button>
                <button class="tab-btn" onclick="openTab(event, 'notes')">Product Visuals</button>
            </div>

            <div class="tab-content" id="info" style="display: block;">
                <div class="pdp-info-rich">
                    <p class="pdp-info-description">${escapeHtml(brandDescription(product))}</p>
                    <div>
                        <h4 class="pdp-info-section-title">Product Details</h4>
                        <div class="pdp-info-grid">
${cards}
                        </div>
                    </div>
                </div>
            </div>

            <div class="tab-content" id="notes" style="display: none;">
                <div class="pdp-about-bullets">
                    <h3>Available Visuals</h3>
                    <ul>
${visualBullets}
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <div class="footer-grid">
                <div>
                    <a href="#" class="logo"><img src="assets/scion-logo-footer.png" alt="Scion International"></a>
                    <p style="color: rgba(255,255,255,0.6); max-width: 300px;">Creating evocative pleasures of Fragrance &amp; Beauty worldwide since 1974.</p>
                </div>
                <div>
                    <h4 style="color: var(--color-accent); margin-bottom: 1.5rem;">Links</h4>
                    <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.8rem;">
                        <li><a href="index.html" style="color: rgba(255,255,255,0.6);">Home</a></li>
                        <li><a href="about.html" style="color: rgba(255,255,255,0.6);">About</a></li>
                        <li><a href="${config.listingHref}" style="color: rgba(255,255,255,0.6);">${escapeHtml(product.brandName)}</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="color: var(--color-accent); margin-bottom: 1.5rem;">Contact</h4>
                    <p style="color: rgba(255,255,255,0.6);">Dubai, UAE</p>
                    <p style="color: rgba(255,255,255,0.6);"><a href="mailto:info@scionintl.com" style="color:inherit;">info@scionintl.com</a></p>
                </div>
            </div>
            <div class="footer-bottom">
                &copy; 2025 Scion International. All rights reserved.
            </div>
        </div>
    </footer>

    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init({
            once: true,
            offset: 50,
            duration: 800,
            easing: 'ease-out-cubic'
        });

        function changeImage(el) {
            const mainImg = document.getElementById('mainImage');
            const newSrc = el.querySelector('img').src;
            mainImg.src = newSrc;
            document.querySelectorAll('.pdp-thumb-v').forEach(thumb => thumb.classList.remove('active'));
            el.classList.add('active');
        }

        function openTab(evt, tabName) {
            var i, tabcontent, tablinks;
            tabcontent = document.getElementsByClassName("tab-content");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }
            tablinks = document.getElementsByClassName("tab-btn");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
            document.getElementById(tabName).style.display = "block";
            evt.currentTarget.className += " active";
        }
    </script>
</body>

</html>
`;
}

function renderCards(products) {
    return products.map((product) => {
        const cardImage = encodeRelative(`${product.imageRoot}/${product.images[0]}`);
        const detailHref = `product-${product.slug}.html`;
        return `                <div class="product-card-luxury" data-brand="${escapeHtml(product.filter)}">
                    <div class="product-img-wrap-luxury">
                        <img src="${cardImage}" alt="${escapeHtml(product.title)}" class="product-img-luxury">
                    </div>
                    <div class="product-info-luxury">
                        <span class="product-cat-luxury">${escapeHtml(product.collectionLabel)}</span>
                        <h3 class="product-title-luxury">${escapeHtml(product.title)}</h3>
                        <div class="product-actions-luxury">
                            <a href="${detailHref}" class="add-btn-luxury">View Details</a>
                        </div>
                    </div>
                </div>`;
    }).join('\n\n');
}

function replaceContainerInner(html, containerId, innerHtml) {
    const marker = `id="${containerId}"`;
    const idIndex = html.indexOf(marker);
    if (idIndex === -1) {
        throw new Error(`Container ${containerId} not found`);
    }

    const startTagIndex = html.lastIndexOf('<div', idIndex);
    const openTagEnd = html.indexOf('>', idIndex);
    let depth = 1;
    let cursor = openTagEnd + 1;

    while (depth > 0 && cursor < html.length) {
        const nextOpen = html.indexOf('<div', cursor);
        const nextClose = html.indexOf('</div>', cursor);

        if (nextClose === -1) {
            throw new Error(`Unclosed div for ${containerId}`);
        }

        if (nextOpen !== -1 && nextOpen < nextClose) {
            depth += 1;
            cursor = nextOpen + 4;
        } else {
            depth -= 1;
            cursor = nextClose + 6;
        }
    }

    const closeTagStart = cursor - 6;
    return `${html.slice(0, openTagEnd + 1)}\n${innerHtml}\n            ${html.slice(closeTagStart)}`;
}

const selectedBrandKeys = new Set(process.argv.slice(2).map((value) => value.toLowerCase()));
const activeBrandConfigs = selectedBrandKeys.size
    ? brandConfigs.filter((config) => selectedBrandKeys.has(config.key))
    : brandConfigs;

if (!activeBrandConfigs.length) {
    throw new Error(`No matching brand config for arguments: ${process.argv.slice(2).join(', ')}`);
}

const generatedPages = [];

for (const config of activeBrandConfigs) {
    const products = discoverProducts(config);

    for (const product of products) {
        const fileName = `product-${product.slug}.html`;
        fs.writeFileSync(path.join(root, fileName), renderDetailPage(product, config), 'utf8');
        generatedPages.push(fileName);
    }

    const listingPath = path.join(root, config.listingFile);
    const listingHtml = fs.readFileSync(listingPath, 'utf8');
    const updatedListing = replaceContainerInner(listingHtml, config.listingId, renderCards(products));
    fs.writeFileSync(listingPath, updatedListing, 'utf8');
}

const productPages = fs.readdirSync(root)
    .filter((file) => /^product-.*\.html$/.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

fs.writeFileSync(path.join(root, 'product_pages_list.txt'), `${productPages.join('\n')}\n`, 'utf8');

console.log(`Generated or updated ${generatedPages.length} OneDrive-backed product detail pages.`);
