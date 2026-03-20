const fs = require('fs');
const path = require('path');

const root = __dirname;
const excelPath = path.join(root, 'excel_data.json');
const excel = JSON.parse(fs.readFileSync(excelPath, 'utf8'));
const rows = excel.sheets['Sheet1 (2)'];

function normalizeSlug(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function clean(value) {
    if (value === null || value === undefined) {
        return '';
    }

    return String(value)
        .replace(/\r?\n+/g, ' ')
        .replace(/Â /g, ' ')
        .replace(/Â/g, '')
        .replace(/â€™/g, "'")
        .replace(/Ã¨/g, 'e')
        .replace(/Ã©/g, 'e')
        .replace(/\s+/g, ' ')
        .trim();
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function buildMap() {
    const header = rows[0];
    const map = new Map();

    for (const row of rows.slice(1)) {
        if (!row || clean(row[1]) !== "Maison de l'Avenir") {
            continue;
        }

        const record = {};
        header.forEach((key, index) => {
            record[key || `col_${index}`] = row[index];
        });

        const perfumeName = clean(record['Perfume Name']);
        if (!perfumeName) {
            continue;
        }

        map.set(normalizeSlug(perfumeName), {
            description: clean(record['Updated Description']) || clean(record['Description']),
            collection: clean(record['Collection']),
            productCategory: clean(record['Product Category']),
            size: clean(record['Size']),
            volume: clean(record['Item Volume (Ounces)']),
            targetGroup: clean(record['Targeted Group']),
            fragranceFamily: clean(record['Fragrance Family']),
            fragranceType: clean(record['Fragrance Type (AR)']),
            notes: clean(record['Fragrance Notes ']),
            features: clean(record['Updated Special Feature']) || clean(record['special Feature']),
            feelings: clean(record['Feelings']),
            origin: clean(record['Country of Origin']),
            manufacturer: clean(record['Manufacturer Detail']),
            safety: clean(record['Safety Information']),
            asin: clean(record['ASIN']),
            productName: perfumeName
        });
    }

    return map;
}

function buildInfoMarkup(record) {
    const specs = [
        ['Collection', record.collection],
        ['Product Category', record.productCategory],
        ['Size', record.size],
        ['Volume', record.volume],
        ['Target Group', record.targetGroup],
        ['Fragrance Family', record.fragranceFamily],
        ['Fragrance Type', record.fragranceType],
        ['Signature Notes', record.notes],
        ['Special Features', record.features],
        ['Feelings', record.feelings],
        ['Country of Origin', record.origin],
        ['Manufacturer', record.manufacturer],
        ['Safety Information', record.safety],
        ['ASIN', record.asin]
    ].filter(([, value]) => value);

    const cards = specs.map(([label, value]) => [
        '                    <div class="pdp-info-card">',
        `                        <span class="info-label">${escapeHtml(label)}</span>`,
        `                        <span class="info-value">${escapeHtml(value)}</span>`,
        '                    </div>'
    ].join('\r\n')).join('\r\n');

    return [
        '            <div class="tab-content" id="info" style="display: none;">',
        '                <div class="pdp-info-rich">',
        `                    <p class="pdp-info-description">${escapeHtml(record.description)}</p>`,
        '                    <div>',
        '                        <h4 class="pdp-info-section-title">Product Details</h4>',
        '                        <div class="pdp-info-grid">',
        cards,
        '                        </div>',
        '                    </div>',
        '                </div>',
        '            </div>'
    ].join('\r\n');
}

const maMap = buildMap();
const files = fs.readdirSync(root).filter((file) => /^product-.*\.html$/.test(file));

for (const file of files) {
    const filePath = path.join(root, file);
    let html = fs.readFileSync(filePath, 'utf8');
    const original = html;

    html = html.replace(/\s*<div class="buy-box-stock">In Stock<\/div>\r?\n/g, '\r\n');

    if (file.startsWith('product-ma-')) {
        const slug = file.replace(/^product-ma-/, '').replace(/\.html$/, '');
        const record = maMap.get(slug);

        if (record && record.description) {
            html = html.replace(
                /            <div class="tab-content" id="info" style="display: none;">[\s\S]*?(?=\r?\n\s*<\/div>\r?\n\s*<\/section>\r?\n\r?\n\s*<!-- Visual Banner -->)/,
                buildInfoMarkup(record)
            );
        } else {
            console.log(`No MA detail data for ${file}`);
        }
    }

    if (html !== original) {
        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`Updated ${file}`);
    }
}
