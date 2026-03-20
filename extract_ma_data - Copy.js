const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelPath = "C:\\Users\\idkth\\Documents\\scion\\assets\\2. Shared with agency folder\\Brands\\MA\\MA Amazon USA Listing.xlsx";
const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rawDataRows = xlsx.utils.sheet_to_json(sheet, {header: 1});

const products = [
    'eternal-oud', 'ethereal-embrace', 'jardin-de-jade', 'noir-intense', 'vortex-echo',
    'aurora-opulence', 'avenir-triumph', 'majestic-millenium', 'midnight-solstice',
    'opulent-odyssey', 'oud-opulence', 'electra-elixir', 'nebula-nectar', 'nova-noir', 'oud-intense'
];

const maData = {};

// Skip header row
for (let i = 1; i < rawDataRows.length; i++) {
    const row = rawDataRows[i];
    const name = row[28] ? String(row[28]).trim() : ""; // Index 28 has "Eternal Oud"
    const longTitle = row[3] ? String(row[3]).trim() : "";
    const amazonLink = row[36] ? String(row[36]).trim() : "";
    const category = row[27] ? String(row[27]).trim() : "";
    
    if (!name) continue;

    // Identify which product this is based on the name
    let matchedSlug = null;
    for (const slug of products) {
        const keywords = slug.split('-');
        if (keywords.every(kw => name.toLowerCase().includes(kw))) {
            matchedSlug = slug;
            break;
        }
    }

    if (matchedSlug) {
        const bullets = [];
        // Desired indices for bullet points: 4, 10, 12, 14, 16
        [4, 10, 12, 14, 16].forEach(idx => {
            if (row[idx]) {
                let val = String(row[idx]).trim();
                // If it ends with a pipe or something, clean it.
                val = val.replace(/\|$/, "").trim();
                bullets.push(val);
            }
        });
        
        maData[matchedSlug] = {
            title: longTitle,
            bullets: bullets,
            link: amazonLink,
            category: category
        };
    }
}

fs.writeFileSync('C:\\Users\\idkth\\Documents\\scion\\ma_extracted_data.json', JSON.stringify(maData, null, 2));
console.log(`Extraction complete. Found data for ${Object.keys(maData).length} products.`);
console.log("Matched slugs:", Object.keys(maData));
