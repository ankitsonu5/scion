const xlsx = require('xlsx');
const excelPath = "C:\\Users\\idkth\\Documents\\scion\\assets\\2. Shared with agency folder\\Brands\\MA\\MA Amazon USA Listing.xlsx";
const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rawDataRows = xlsx.utils.sheet_to_json(sheet, {header: 1});

for (let i = 1; i < Math.min(rawDataRows.length, 20); i++) {
    const row = rawDataRows[i];
    console.log(`Row ${i} - Col 2: [${row[2]}] - Col 3: [${row[3] ? row[3].substring(0, 30) + "..." : "EMPTY"}]`);
}
