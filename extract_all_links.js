const XLSX = require('xlsx');

const filePath = 'c:\\Users\\idkth\\Documents\\scion\\assets\\OneDrive_2026-03-19 (2)\\2. Shared with agency folder\\Brands\\MA\\MA Amazon USA Listing.xlsx';

try {
    const workbook = XLSX.readFile(filePath);
    workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        data.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if (cell && typeof cell === 'string' && (cell.includes('http') || cell.includes('amazon'))) {
                    console.log(`Sheet: ${sheetName}, Row: ${rowIndex + 1}, Col: ${cellIndex}, Value: ${cell}`);
                }
            });
        });
    });
} catch (error) {
    console.error('Error:', error.message);
}
