const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.resolve('c:/Users/idkth/Documents/scion/assets/OneDrive_2026-03-19 (1)/2. Shared with agency folder/Brands/MA/MA Amazon USA Listing.xlsx');

const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

console.log("Headers:", data[0]);
console.log("Sample Row:", data[1]);

const links = {};
data.forEach((row, i) => {
    if (i === 0) return;
    const productName = row[1]; // Column B usually
    const amazonLink = row[6]; // Column G (Storefront URL) or similar
    if (productName && amazonLink) {
        links[productName] = amazonLink;
    }
});

console.log("Extracted Links:", JSON.stringify(links, null, 2));
