const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelPath = "C:\\Users\\idkth\\Documents\\scion\\assets\\OneDrive_2026-03-19 (2)\\2. Shared with agency folder\\Brands\\MA\\MA Amazon USA Listing.xlsx";
const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames.includes('Sheet1 (2)') ? 'Sheet1 (2)' : workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rawDataRows = xlsx.utils.sheet_to_json(sheet, {header: 1});

const products = [
    'eternal-oud', 'ethereal-embrace', 'jardin-de-jade', 'noir-intense', 'vortex-echo',
    'aurora-opulence', 'avenir-triumph', 'majestic-millenium', 'midnight-solstice',
    'opulent-odyssey', 'oud-opulence', 'electra-elixir', 'nebula-nectar', 'nova-noir', 'oud-intense'
];

const maData = {};
const uaeLinks = {
    "aurora-opulence": "https://www.amazon.ae/Maison-lAvenir-Aurora-Opulence-Fragrance/dp/B0DGLHZCNX",
    "eternal-oud": "https://www.amazon.ae/Maison-lAvenir-Eternal-Oud-Fragrance/dp/B0DGLLSH43",
    "ethereal-embrace": "https://www.amazon.ae/Maison-lAvenir-Ethereal-Embrace-Fragrance/dp/B0DGLM918B",
    "jardin-de-jade": "https://www.amazon.ae/Maison-lAvenir-Jardin-Jade-Fragrance/dp/B0DG919KGY",
    "noir-intense": "https://www.amazon.ae/Maison-lAvenir-Noir-Intense-Fragrance/dp/B0DZX2RL6P",
    "avenir-triumph": "https://www.amazon.ae/dp/B0DGLLSZ3Z",
    "electra-elixir": "https://www.amazon.ae/dp/B0DG91RTPJ",
    "majestic-millenium": "https://www.amazon.ae/dp/B0DG91RP8F",
    "midnight-solstice": "https://www.amazon.ae/dp/B0DGLLPVM4",
    "nebula-nectar": "https://www.amazon.ae/dp/B0DG91YF2G",
    "nova-noir": "https://www.amazon.ae/dp/B0DGLLPVM4",
    "opulent-odyssey": "https://www.amazon.ae/dp/B0DG91LRYK",
    "oud-intense": "https://www.amazon.ae/dp/B0DG91RP8F",
    "oud-opulence": "https://www.amazon.ae/dp/B0DG91LRYK",
    "vortex-echo": "https://www.amazon.ae/dp/B0DGLLS26V"
};

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
            category: category,
            uaeLink: uaeLinks[matchedSlug] || ""
        };
    }
}

fs.writeFileSync('C:\\Users\\idkth\\Documents\\scion\\ma_extracted_data.json', JSON.stringify(maData, null, 2));
console.log(`Extraction complete. Found data for ${Object.keys(maData).length} products.`);
console.log("Matched slugs:", Object.keys(maData));
