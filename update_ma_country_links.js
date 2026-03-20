const fs = require('fs');
const path = require('path');

const root = __dirname;
const dataPath = path.join(root, 'ma_extracted_data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const files = fs.readdirSync(root).filter((file) => /^product-ma-.*\.html$/.test(file));

for (const file of files) {
    const slug = file.replace(/^product-ma-/, '').replace(/\.html$/, '');
    const product = data[slug];

    if (!product || !product.link || !product.uaeLink) {
        console.log(`Skipping ${file}: missing marketplace links`);
        continue;
    }

    const filePath = path.join(root, file);
    const html = fs.readFileSync(filePath, 'utf8');

    const replacement = [
        '                        <div class="buy-box-actions">',
        '                            <div class="pdp-country-links">',
        '                                <div class="pdp-market-label">Shop by country</div>',
        '                                <div class="pdp-market-grid">',
        `                                    <a href="${product.link}" target="_blank" rel="noopener noreferrer" class="pdp-amazon-btn">`,
        '                                        <img src="https://flagcdn.com/w40/us.png" alt="USA flag" class="market-flag">',
        '                                        <span class="market-copy">',
        '                                            <strong>USA</strong>',
        '                                            <span>Amazon.com</span>',
        '                                        </span>',
        '                                    </a>',
        `                                    <a href="${product.uaeLink}" target="_blank" rel="noopener noreferrer" class="pdp-amazon-btn">`,
        '                                        <img src="https://flagcdn.com/w40/ae.png" alt="UAE flag" class="market-flag">',
        '                                        <span class="market-copy">',
        '                                            <strong>UAE</strong>',
        '                                            <span>Amazon.ae</span>',
        '                                        </span>',
        '                                    </a>',
        '                                </div>',
        '                                <p class="pdp-market-note">Choose your preferred marketplace for Maison de l\'Avenir availability.</p>',
        '                            </div>',
        '                        </div>'
    ].join('\r\n');

    const updated = html.replace(
        / {24}<div class="buy-box-actions">[\s\S]*? {24}<\/div>/,
        replacement
    );

    if (updated === html) {
        console.log(`No matching buy-box block found in ${file}`);
        continue;
    }

    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated ${file}`);
}
