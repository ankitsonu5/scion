const xlsx = require("xlsx");
const excelPath =
  "C:\\Users\\idkth\\Documents\\scion\\assets\\2. Shared with agency folder\\Brands\\MA\\MA Amazon USA Listing.xlsx";
const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rawDataRows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

if (rawDataRows.length > 0) {
  const headers = rawDataRows[0];
  headers.forEach((h, i) => {
    console.log(`${i}: [${h}]`);
  });
}
